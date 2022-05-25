import React from 'react'

const Geo = (props) => {
    const [YOUR_LAT, YOUR_LON] = props.children.split(',');
  return (
    <div>
      <iframe src = {"https://maps.google.com/maps?q=" + YOUR_LAT.toString() + "+" + YOUR_LON.toString() + "&hl=es;z=14&output=embed"}></iframe>
    </div>
  );
}

export default Geo