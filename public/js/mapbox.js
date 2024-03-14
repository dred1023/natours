/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZHJlZDEwMjMiLCJhIjoiY2xzd2hhNndkMmxkNTJpcHMyZG5sdThnaSJ9.Nu7Jr8AWB5FIM49sbcZnRw';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/dred1023/clswgynsg002501o8a3bmd6us',
    scrollZoom: false
    //限制縮放 在Tour顯示旅遊的地圖中
  });

  const bounds = new mapboxgl.LngLatBounds(); //訪問Mapbox資料庫
  //通常拿來調整視野 如左右寬度 上下長度

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates) //讀取座標
      .addTo(map); //加到上面Mapbox定義的map

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // 擴展當前地圖使涵蓋到座標範圍
    bounds.extend(loc.coordinates);
  });

  //使座標可以出現在地圖的特定範圍
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
