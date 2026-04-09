exports.handler = async (event) => {
  const paperId = event.queryStringParameters.id;

  const res = await fetch(
    `https://api.semanticscholar.org/graph/v1/paper/${paperId}?fields=title,citations.title`
  );

  const data = await res.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};