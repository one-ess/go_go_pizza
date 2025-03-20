const getProducts = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Fetch failed");
    }
  } catch (error) {
    console.error(`Error fetching: ${error}`);
  }
};

export default getProducts;
