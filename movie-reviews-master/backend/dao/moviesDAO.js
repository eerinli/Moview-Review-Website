import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let Movies

export default class MoviesDAO {
  static async injectDB(conn) {
    if (Movies) {
      return
    }
    try {
      Movies = await conn.db(process.env.RESTREVIEWS_NS).collection("Movies")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in MoviesDAO: ${e}`,
      )
    }
  }

  static async getMovies({
    filters = null,
    page = 0,
    MoviesPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } }
      } else if ("cuisine" in filters) {
        query = { "cuisine": { $eq: filters["cuisine"] } }
      } else if ("zipcode" in filters) {
        query = { "address.zipcode": { $eq: filters["zipcode"] } }
      }
    }

    let cursor
    
    try {
      cursor = await Movies
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { MoviesList: [], totalNumMovies: 0 }
    }

    const displayCursor = cursor.limit(MoviesPerPage).skip(MoviesPerPage * page)

    try {
      const MoviesList = await displayCursor.toArray()
      const totalNumMovies = await Movies.countDocuments(query)

      return { MoviesList, totalNumMovies }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { MoviesList: [], totalNumMovies: 0 }
    }
  }
  static async getMovieByID(id) {
    try {
      const pipeline = [
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
              {
                  $lookup: {
                      from: "reviews",
                      let: {
                          id: "$_id",
                      },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ["$Movie_id", "$$id"],
                                  },
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      as: "reviews",
                  },
              },
              {
                  $addFields: {
                      reviews: "$reviews",
                  },
              },
          ]
      return await Movies.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getMovieByID: ${e}`)
      throw e
    }
  }

  static async getCuisines() {
    let cuisines = []
    try {
      cuisines = await Movies.distinct("cuisine")
      return cuisines
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`)
      return cuisines
    }
  }
}



