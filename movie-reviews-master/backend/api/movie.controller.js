import movieDAO from "../dao/movieDAO.js"

export default class movieController {
  static async apiGetmovie(req, res, next) {
    const moviePerPage = req.query.moviePerPage ? parseInt(req.query.moviePerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode
    } else if (req.query.name) {
      filters.name = req.query.name
    }

    const { movieList, totalNummovie } = await movieDAO.getmovie({
      filters,
      page,
      moviePerPage,
    })

    let response = {
      movie: movieList,
      page: page,
      filters: filters,
      entries_per_page: moviePerPage,
      total_results: totalNummovie,
    }
    res.json(response)
  }
  static async apiGetMovieById(req, res, next) {
    try {
      let id = req.params.id || {}
      let Movie = await movieDAO.getMovieByID(id)
      if (!Movie) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(Movie)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetMovieCuisines(req, res, next) {
    try {
      let cuisines = await movieDAO.getCuisines()
      res.json(cuisines)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}