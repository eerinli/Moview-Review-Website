exports = async function(payload, response) {
  
  const reviews = context.services.get("mongodb-atlas").db("sample_movie").collection("reviews");
  const deleteResponse = await reviews.deleteOne({
    _id: BSON.ObjectId(payload.query.id)
  })

  return deleteResponse
    
};