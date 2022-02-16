exports = async function(payload, response) {

  if (payload.body) {
      const body =  EJSON.parse(payload.body.text());
      const reviews = context.services.get("mongodb-atlas").db("sample_movie").collection("reviews");
      
      const reviewDoc = {
          name: body.name,
          user_id: body.user_id,
          date: new Date(),
          text: body.text,
          movie_id: BSON.ObjectId(body.movie_id)
      };
  
      return await reviews.insertOne(reviewDoc);
  }

  return  {};
};