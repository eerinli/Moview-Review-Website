exports = async function(payload, response) {

  const {moviePerPage = 20, page = 0} = payload.query;

  let query = {};
  if (payload.query.cuisine) {
    query = { $text: { $search: payload.query.cuisine } }
  } else if (payload.query.zipcode) {
    query = { "address.zipcode": { $eq: payload.query.zipcode } }
  } else if (payload.query.name) {
    query = { $text: { $search: payload.query.name } }
  }
    
  const collection = context.services.get("mongodb-atlas").db("sample_movie").collection("movie");
  let movieList = await collection.find(query).skip(page*moviePerPage).limit(moviePerPage).toArray()

  movieList.forEach(movie => {
    movie._id = movie._id.toString();
  });

  const responseData = {
    movie: movieList,
    page: page.toString(),
    filters: {},
    entries_per_page: moviePerPage.toString(),
    total_results: movieList.length.toString(),
  };
  
  return responseData;
};