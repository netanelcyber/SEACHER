exports.handler = async (event) => {
  try {
    const query = event.queryStringParameters?.q;

    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Query parameter 'q' is required" }),
      };
    }

    // OpenAlex allows for powerful filtering. 
    // This URL searches works based on your query string.
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&select=id,title,publication_year,display_name`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Adding your email puts you in the "polite pool" for faster processing
        "User-Agent": "YourAppName/1.0 (mailto:your-email@huji.ac.il)"
      },
    });

    if (!res.ok) {
      throw new Error(`OpenAlex API responded with status: ${res.status}`);
    }

    const data = await res.json();

    // Mapping the data to a cleaner format
    const papers = data.results.map((work) => ({
      id: work.id,
      title: work.title,
      year: work.publication_year,
      url: work.id, // OpenAlex IDs are valid URLs
    }));

    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // Useful if calling from a browser
      },
      body: JSON.stringify({
        total_results: data.meta.count,
        papers: papers
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};