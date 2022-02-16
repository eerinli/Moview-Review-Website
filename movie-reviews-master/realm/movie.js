// This function is the webhook's request handler.
exports = async function(payload, response) {
  
  const id = payload.query.id || ""

  const movie = context.services.get("mongodb-atlas").db("sample_movie").collection("movie");

  const pipeline = [
    {
        $match: {
            _id: BSON.ObjectId(id),
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
                                  $eq: ["$movie_id", "$$id"],
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
      
      movie = await movie.aggregate(pipeline).next()
      movie._id = movie._id.toString()
      
      movie.reviews.forEach(review => {
        review.date = new Date(review.date).toString()
        review._id = review._id.toString();
      });
  return movie
};