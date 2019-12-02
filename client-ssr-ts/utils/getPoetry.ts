const getPoetry = async () => {
  const res = await fetch('https://v1.jinrishici.com/all.json')
  const json = await res.json()

  return json;
}

export default getPoetry;