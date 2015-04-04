require 'json'
file = File.read('../data/Lyon.json')
hash = JSON.parse(file)
f = ''
hash.each_with_index do |k,_v, index|
    f << "{\n"
    f << %Q(   "type": "Feature",\n)
    f << %Q(   "properties": {\n)
    f << %Q(   "name": "#{k['name']}"\n)
    f << "   },\n"
    f << %Q(   "geometry": {\n)
    f << %Q(     "type": "Point",\n)
    f << %Q(     "coordinates": [#{k['longitude']},#{k['latitude']}]\n)
    f << "   }\n"
    if hash.size-1 == index
      f <<"}\n"
    else
      f <<"},\n"
    end
end
File.open('../data/lyon_velov.geojson', 'w') do |file|
  file << "{"
  file << %Q("type": "FeatureCollection",)
  file << %Q("features": [ )
  file << f
  file << "]"
  file << "}"
end