import express from "express"
import movieCtrl from "./movie.controller.js"
import ReviewsCtrl from "./move.controller.js"

const router = express.Router()

router.route("/").get(movieCtrl.apiGetmovie)
router.route("/id/:id").get(movieCtrl.apiGetMovieById)
router.route("/cuisines").get(movieCtrl.apiGetMovieCuisines)

router
  .route("/review")
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview)

export default router