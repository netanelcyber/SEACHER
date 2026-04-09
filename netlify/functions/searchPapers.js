exports.handler = async (event) => {
  const query = event.queryStringParameters.q;

  const res = await fetch(
    `https://api.semanticscholar.org/graph/v1/paper/search?query=${query}&fields=title,authors,year`
  );

  const data = await res.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};