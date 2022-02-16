import React, { useState, useEffect } from "react";
import movieDataService from "../services/movie";
import { Link } from "react-router-dom";

const movie = props => {
  const initialmovietate = {
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: []
  };
  const [movie, setmovie] = useState(initialmovietate);

  const getmovie = id => {
    movieDataService.get(id)
      .then(response => {
        setmovie(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getmovie(props.match.params.id);
  }, [props.match.params.id]);

  const deleteReview = (reviewId, index) => {
    movieDataService.deleteReview(reviewId, props.user.id)
      .then(response => {
        setmovie((prevState) => {
          prevState.reviews.splice(index, 1)
          return({
            ...prevState
          })
        })
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {movie ? (
        <div>
          <h5>{movie.name}</h5>
          <p>
            <strong>Cuisine: </strong>{movie.cuisine}<br/>
            <strong>Address: </strong>{movie.address.building} {movie.address.street}, {movie.address.zipcode}
          </p>
          <Link to={"/movie/" + props.match.params.id + "/review"} className="btn btn-primary">
            Add Review
          </Link>
          <h4> Reviews </h4>
          <div className="row">
            {movie.reviews.length > 0 ? (
             movie.reviews.map((review, index) => {
               return (
                 <div className="col-lg-4 pb-1" key={index}>
                   <div className="card">
                     <div className="card-body">
                       <p className="card-text">
                         {review.text}<br/>
                         <strong>User: </strong>{review.name}<br/>
                         <strong>Date: </strong>{review.date}
                       </p>
                       {props.user && props.user.id === review.user_id &&
                          <div className="row">
                            <a onClick={() => deleteReview(review._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</a>
                            <Link to={{
                              pathname: "/movie/" + props.match.params.id + "/review",
                              state: {
                                currentReview: review
                              }
                            }} className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
                          </div>                   
                       }
                     </div>
                   </div>
                 </div>
               );
             })
            ) : (
            <div className="col-sm-4">
              <p>No reviews yet.</p>
            </div>
            )}

          </div>

        </div>
      ) : (
        <div>
          <br />
          <p>No movie selected.</p>
        </div>
      )}
    </div>
  );
};

export default movie;