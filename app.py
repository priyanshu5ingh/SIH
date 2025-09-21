# app.py
from flask import Flask, render_template_string, request

app = Flask(__name__)

# In-memory "database"
batches = {}
products = {}

# Demo Blockchain Data
blockchain = [
    {"block": 1, "hash": "000abc123", "info": "Batch creation"},
    {"block": 2, "hash": "001def456", "info": "Lab verification"},
    {"block": 3, "hash": "002ghi789", "info": "Manufacturing"},
]

# HTML Template with GPS auto-fill
template = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AgroChain Cinematic Prototype</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.2/dist/tailwind.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css"/>
<style>
body { background: linear-gradient(to right, #1f2937, #374151); color: #f9fafb; font-family: 'Poppins', sans-serif; }
.card { background: linear-gradient(145deg, #2d2f33, #3a3c41); border-radius: 1rem; padding: 1rem; margin: 2rem 0; box-shadow: 0 0 25px rgba(0,0,0,0.7); opacity:0; transform: translateY(50px);}
.card:hover { box-shadow: 0 0 30px #4ade80, 0 0 50px #22d3ee; background: linear-gradient(145deg, #3a3c41, #4b4d51);}
.glow-button { background: linear-gradient(90deg, #4ade80, #22d3ee); padding: 0.5rem 1rem; border-radius: 0.5rem; color: black; font-weight:bold;}
.glow-button:hover { box-shadow: 0 0 10px #4ade80, 0 0 25px #22d3ee; }
.timeline-item { opacity:0; transform: translateX(-50px);}
.block-card { cursor:pointer; transition: all 0.3s; background: linear-gradient(145deg, #2d2f33, #3a3c41); padding:0.8rem; border-radius:0.8rem; margin-bottom:0.5rem; box-shadow:0 0 15px rgba(0,0,0,0.5);}
.block-card:hover { transform: translateY(-5px); box-shadow: 0 0 20px #4ade80; background: linear-gradient(145deg, #3a3c41, #4b4d51);}
</style>
</head>
<body class="p-6">

<h1 class="text-4xl font-bold mb-6 text-center">🌱 AgroChain Cinematic Prototype</h1>

<!-- Farmer Batch Logging -->
<div class="card" id="farmer-card">
  <h2 class="text-xl font-semibold mb-2">Farmer Batch Logging</h2>
  <form method="POST" action="/farmer">
    <input name="batch_id" placeholder="Batch ID" class="p-2 rounded mb-2 w-full text-black" required>
    <input name="crop" placeholder="Crop Name" class="p-2 rounded mb-2 w-full text-black" required>
    <input id="gps-input" name="gps" placeholder="GPS (auto-detecting…)" class="p-2 rounded mb-2 w-full text-black" required>
    <button class="glow-button">Submit Batch</button>
  </form>
  {% if farmer_success %}
  <div class="mt-2 p-2 bg-green-600 rounded">
    ✅ Batch Logged! ID: {{farmer_success.batch_id}}, Crop: {{farmer_success.crop}}, GPS: {{farmer_success.gps}}
  </div>
  {% endif %}
</div>

<!-- Lab Result Logging -->
<div class="card" id="lab-card">
  <h2 class="text-xl font-semibold mb-2">🧪 Lab Result Logging (Optional)</h2>
  <form method="POST" action="/lab">
    <input name="batch_id" placeholder="Batch ID" class="p-2 rounded mb-2 w-full text-black" required>
    <input name="lab_result" placeholder="Result Details" class="p-2 rounded mb-2 w-full text-black" required>
    <button class="glow-button">Submit Lab Result</button>
  </form>
  {% if lab_success %}
  <div class="mt-2 p-2 bg-blue-600 rounded">
    ✅ Lab Result Logged for Batch ID: {{lab_success.batch_id}}
  </div>
  {% endif %}
</div>

<!-- Manufacturer Logging -->
<div class="card" id="manufacturer-card">
  <h2 class="text-xl font-semibold mb-2">🏭 Manufacturer Product Logging</h2>
  <form method="POST" action="/manufacturer">
    <input name="product_id" placeholder="Product ID" class="p-2 rounded mb-2 w-full text-black" required>
    <input name="batch_id" placeholder="Batch ID" class="p-2 rounded mb-2 w-full text-black" required>
    <button class="glow-button">Submit Product</button>
  </form>
  {% if manufacturer_success %}
  <div class="mt-2 p-2 bg-yellow-600 rounded text-center">
    ✅ Product Logged! ID: {{manufacturer_success.product_id}}
    <div id="qr-code" class="mx-auto mt-2"></div>
    <script>
      QRCode.toCanvas(document.getElementById('qr-code'), '{{manufacturer_success.product_id}}', { width:150 }, function (error) { if (error) console.error(error); });
      gsap.to("#qr-code",{scale:1.05, repeat:-1, yoyo:true, duration:1});
    </script>
  </div>
  {% endif %}
</div>

<!-- Consumer Tracking Page -->
{% if product_id %}
<div class="card" id="consumer-card">
  <h2 class="text-xl font-semibold mb-2">🧾 Consumer Product Tracking</h2>
  <p>Product ID: {{product_id}}</p>
  <div class="mt-2">
    <h3 class="font-semibold mb-2">Journey Timeline</h3>
    <ul>
      {% for step in journey %}
      <li class="timeline-item mb-1 p-1 bg-gray-700 rounded">{{step}}</li>
      {% endfor %}
    </ul>
  </div>
  <div id="map" style="height:250px;" class="mt-4 rounded"></div>
  <script>
    var map = L.map('map').setView([28.6139,77.2090],5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    {% for i,step in enumerate(map_coords) %}
      var marker = L.marker([{{step[0]}},{{step[1]}}]).addTo(map).bindPopup("Step {{i+1}}");
      gsap.from(marker._icon,{y:-50, opacity:0, duration:1, delay:i*0.5});
    {% endfor %}
    gsap.to(".timeline-item",{opacity:1, x:0, stagger:0.5, duration:1, ease:"power2.out"});
  </script>
</div>
{% endif %}

<!-- Blockchain Viewer -->
<div class="card" id="blockchain-card">
  <h2 class="text-xl font-semibold mb-2">🔗 Blockchain Viewer</h2>
  {% for block in blockchain %}
  <div class="block-card" onclick="toggleBlock('{{block.block}}')">
    <strong>Block {{block.block}}:</strong> Hash: {{block.hash}}
    <div id="block-details-{{block.block}}" style="display:none; margin-top:0.5rem;">
      {{block.info}}
    </div>
  </div>
  {% endfor %}
</div>

<!-- Scripts -->
<script>
// Cinematic animations
gsap.registerPlugin(ScrollTrigger);
gsap.utils.toArray('.card').forEach(card => {
  gsap.to(card, {opacity:1, y:0, duration:0.8, scrollTrigger:{trigger:card, start:"top 80%"}});
});
function toggleBlock(id){
  var el = document.getElementById("block-details-"+id);
  if(el.style.display==="none"){ el.style.display="block"; gsap.from(el,{opacity:0, y:-10,duration:0.5}); }
  else{ el.style.display="none"; }
}

// GPS Auto-fill
window.addEventListener('load', () => {
    const gpsInput = document.getElementById('gps-input');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lon = position.coords.longitude.toFixed(6);
                gpsInput.value = lat + "," + lon;
            },
            (error) => {
                console.error("GPS error:", error);
                gpsInput.value = "Unable to detect GPS";
            }
        );
    } else {
        gpsInput.value = "Geolocation not supported";
    }
});
</script>

</body>
</html>
"""

# Routes
@app.route("/", methods=["GET"])
def index():
    product_id = request.args.get("product_id")
    journey = []
    map_coords = []
    if product_id and product_id in products:
        journey = products[product_id]["journey"]
        map_coords = products[product_id]["map_coords"]
    return render_template_string(template, farmer_success=None, lab_success=None,
                                  manufacturer_success=None, product_id=product_id,
                                  journey=journey, map_coords=map_coords, blockchain=blockchain)

@app.route("/farmer", methods=["POST"])
def farmer():
    batch_id = request.form["batch_id"]
    crop = request.form["crop"]
    gps = request.form.get("gps","Auto-Detected: 28.6139,77.2090")
    batches[batch_id] = {"crop": crop, "gps": gps}
    return render_template_string(template, farmer_success={"batch_id": batch_id, "crop": crop, "gps": gps},
                                  lab_success=None, manufacturer_success=None, product_id=None,
                                  journey=[], map_coords=[], blockchain=blockchain)

@app.route("/lab", methods=["POST"])
def lab():
    batch_id = request.form["batch_id"]
    lab_result = request.form["lab_result"]
    if batch_id in batches:
        batches[batch_id]["lab_result"] = lab_result
    return render_template_string(template, lab_success={"batch_id": batch_id},
                                  farmer_success=None, manufacturer_success=None, product_id=None,
                                  journey=[], map_coords=[], blockchain=blockchain)

@app.route("/manufacturer", methods=["POST"])
def manufacturer():
    product_id = request.form["product_id"]
    batch_id = request.form["batch_id"]
    journey = [f"Batch {batch_id} logged", "Product processed in factory", "Product shipped"]
    map_coords = [(28.6139,77.2090),(19.0760,72.8777),(13.0827,80.2707)]
    products[product_id] = {"batch_id": batch_id, "journey": journey, "map_coords": map_coords}
    return render_template_string(template, manufacturer_success={"product_id": product_id},
                                  farmer_success=None, lab_success=None, product_id=None,
                                  journey=[], map_coords=[], blockchain=blockchain)

if __name__ == "__main__":
    app.run(debug=True)
