import { useState, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "./axios";
import "./Row.css";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original";
const Row = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl,setTrailerUrl] = useState("");

  useEffect(() => {
    //
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      // console.log(request.data.results);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts= {
    height : "390",
    width : "100%",
    playerVars : {
      autoplay : 1
    },
  };

  const handleClick = async (movie) => {
    if(trailerUrl){
      setTrailerUrl('');
    }else{
      movieTrailer(movie?.name || "")
      .then(url => {
        const urlParams =new URLSearchParams( new URL(url).search);
        setTrailerUrl(urlParams.get('v'));
      }).catch(error => console.log(error))
    }
  //   let trailerurl = await axios.get(
  //     `/movie/${movie.id}/videos?api_key=337fd9592a61effadecde4cb1bc0aaaa`
  //   );
  //   setTrailerUrl(trailerurl.data.results[0]?.key);
  // }
  }

  //console.table(movies);
  return (
    <div className="row">
      <h3>{title}</h3>
      <div className="row_posters">
        {movies.map(
          (movie) =>
            movie.bacdrop_path !== null && (
              <img
              onClick={()=> handleClick(movie)}
                key={movie.id}
                className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                src={`${base_url}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
              />
            )
        )}
      </div>
      {trailerUrl && <YouTube videoId = {trailerUrl} opts={opts} />}
    </div>
  );
};

export default Row;
