const clusterMajority = (cluster) => {
  let total_speed = 0;
  let total_points = 0;
  let o = {
    'above': 0,
    'below': 0,
    'zero': 0,
    'null': 0
  }
  for (let i = 0; i < cluster.length; i++) {
    if (cluster[i].options.speed !== null) {
      let speed = cluster[i].options.speed;
      if (speed > 3) {
        o['above'] += 1;

      } else if (speed == 0) {
        o['zero'] += 1;
      } else if (speed < 3) {
        o['below'] += 1;
      }
      total_speed += speed;
      total_points++;
    } else {
      o['null'] += 1;
    }
  }
  let key = Object.keys(o).reduce(function(a, b) {
    return o[a] > o[b] ? a : b
  });
  // console.log(cluster.length, o, key);
  // if (total_points !== 0) {
  //   return total_speed / total_points;
  // } else {
  //   return 0;
  // }
  return key;



}

export default clusterMajority;