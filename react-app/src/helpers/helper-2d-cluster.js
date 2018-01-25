const arrToCluster = (params, data) => {
  let list_of_schools = []
  for (let i = 0; i < data.length; i++) {
    let o = {}
    o['position'] = [data[i][1], data[i][2]]
    o['options'] = {
      speed: data[i][3],
      type: data[i][4]
    }
    list_of_schools[i] = o;
  }
  return list_of_schools;
}
export default arrToCluster;