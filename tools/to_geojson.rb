require 'json'
file = File.read('../data/Lyon.json')
hash = JSON.parse(file)
f = ''
hash.each do |k,_v|
    f << "{\n"
    f << "  'type': 'Feature',\n"
    f << "  'properties': {\n"
    f << """     'name': '#{k['name']}'\n"""
    f << "   },\n"
    f << "  'geometry': {\n"
    f << "    'type': 'Point',\n"
    f << """    'coordinates': [#{k['latitude']},#{k['longitude']}]\n"""
    f << "   }\n"
    f <<"},\n"
end
File.open('../data/lyon.geojson', 'w') do |file|
  file << "{"
  file << "'type': 'FeatureCollection',"
  file << "'features': [ "
  file << f
  file << "]"
  file << "}"
end