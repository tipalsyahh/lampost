export async function handler() {
  try {
    const res = await fetch(
      'https://lampost.co/microweb/universitaslampung/wp-json/wp/v2/posts?per_page=2&orderby=date&order=desc&_embed'
    );

    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };

  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'gagal' })
    };
  }
}