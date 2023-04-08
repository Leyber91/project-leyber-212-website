from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os
import requests
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
import xml.etree.ElementTree as ET
from xmljson import badgerfish as bf


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://sfcdfdpjqyuwmv:660930987a33a88d9045379be0f846eefe8a998dc2627e74d3538095c491a413@ec2-35-169-9-79.compute-1.amazonaws.com:5432/d2bc4pipooeeg4"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

def update_exoplanets():
    fetch_and_update_exoplanets()
    return jsonify({'message': 'Exoplanets updated successfully'}), 200

# Function to run scheduled update of exoplanets
def scheduled_update():
    print("Running scheduled update of exoplanets...")
    fetch_and_update_exoplanets()
    print("Scheduled update of exoplanets completed.")

# Create a scheduler and add a job to run the scheduled_update function every 24 hours
scheduler = BackgroundScheduler()
scheduler.add_job(scheduled_update, 'interval', hours=24)
scheduler.start()

print("1. Flask app and database initialized")

class Exoplanet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    pl_dens = db.Column(db.Float, nullable=True)
    pl_denserr1 = db.Column(db.Float, nullable=True)
    pl_denserr2 = db.Column(db.Float, nullable=True)
    hostname = db.Column(db.String, nullable=True)
    pl_bmassj = db.Column(db.Float, nullable=True)
    pl_radj = db.Column(db.Float, nullable=True)
    st_dist = db.Column(db.Float, nullable=True)
    pl_disc = db.Column(db.String, nullable=True)
    pl_discmethod = db.Column(db.String, nullable=True)
    pl_facility = db.Column(db.String, nullable=True)
    pl_eqt = db.Column(db.Float, nullable=True)
    pl_disc_reflink = db.Column(db.String, nullable=True)
    pl_pelink = db.Column(db.String, nullable=True)
    pl_edelink = db.Column(db.String, nullable=True)
    pl_publ_date = db.Column(db.String, nullable=True)
    pl_mnum = db.Column(db.Integer, nullable=True)
    pl_orbsmax = db.Column(db.Float, nullable=True)
    pl_orbsmaxerr1 = db.Column(db.Float, nullable=True)
    pl_orbsmaxerr2 = db.Column(db.Float, nullable=True)
    pl_orbeccen = db.Column(db.Float, nullable=True)
    pl_orbeccenerr1 = db.Column(db.Float, nullable=True)
    pl_orbeccenerr2 = db.Column(db.Float, nullable=True)
    pl_orbincl = db.Column(db.Float, nullable=True)
    pl_orbinclerr1 = db.Column(db.Float, nullable=True)
    pl_orbinclerr2 = db.Column(db.Float, nullable=True)
    pl_orbper = db.Column(db.Float, nullable=True)
    pl_orbpererr1 = db.Column(db.Float, nullable=True)
    pl_orbpererr2 = db.Column(db.Float, nullable=True)
    pl_orblper = db.Column(db.Float, nullable=True)
    pl_ratdor = db.Column(db.Float, nullable=True)
    pl_ratdorerr1 = db.Column(db.Float, nullable=True)
    pl_ratdorerr2 = db.Column(db.Float, nullable=True)
    pl_rvamp = db.Column(db.Float, nullable=True)
    pl_rvamperr1 = db.Column(db.Float, nullable=True)
    pl_rvamperr2 = db.Column(db.Float, nullable=True)
    pl_insol = db.Column(db.Float, nullable=True)
    pl_trandep = db.Column(db.Float, nullable=True)
    pl_trandeperr1 = db.Column(db.Float, nullable=True)
    pl_trandeperr2 = db.Column(db.Float, nullable=True)
    pl_imppar = db.Column(db.Float, nullable=True)
    pl_impparerr1 = db.Column(db.Float, nullable=True)
    pl_impparerr2 = db.Column(db.Float, nullable=True)
    st_teff = db.Column(db.Float, nullable=True)
    st_mass = db.Column(db.Float, nullable=True)
    st_rad = db.Column(db.Float, nullable=True)
    st_lum = db.Column(db.Float, nullable=True)
    st_met = db.Column(db.Float, nullable=True)
    st_logg = db.Column(db.Float, nullable=True)
    st_spstr = db.Column(db.String, nullable=True)
    st_spindx = db.Column(db.Float, nullable=True)
    st_spt = db.Column(db.String, nullable=True)
    sy_pnum = db.Column(db.Integer, nullable=True)
    sy_mnum = db.Column(db.Integer, nullable=True)
    sy_plx = db.Column(db.Float, nullable=True)
    sy_plxerr = db.Column(db.Float, nullable=True)
    sy_plxerr1 = db.Column(db.Float, nullable=True)
    sy_plxerr2 = db.Column(db.Float, nullable=True)
    sy_dist = db.Column(db.Float, nullable=True)
    sy_disterr1 = db.Column(db.Float, nullable=True)
    sy_disterr2 = db.Column(db.Float, nullable=True)
    sy_gaiamag = db.Column(db.Float, nullable=True)
    sy_gaiamagerr1 = db.Column(db.Float, nullable=True)
    sy_gaiamagerr2 = db.Column(db.Float, nullable=True)
    sy_vmag = db.Column(db.Float, nullable=True)
    sy_vmagerr1 = db.Column(db.Float, nullable=True)
    sy_vmagerr2 = db.Column(db.Float, nullable=True)
    sy_jmag = db.Column(db.Float, nullable=True)
    sy_jmagerr1 = db.Column(db.Float, nullable=True)
    sy_jmagerr2 = db.Column(db.Float, nullable=True)
    sy_hmag = db.Column(db.Float, nullable=True)
    sy_hmagerr1 = db.Column(db.Float, nullable=True)
    sy_hmagerr2 = db.Column(db.Float, nullable=True)
    sy_kmag = db.Column(db.Float, nullable=True)
    sy_kmagerr1 = db.Column(db.Float, nullable=True)
    sy_kmagerr2 = db.Column(db.Float, nullable=True)


# Create the tables in the database
with app.app_context():
    db.create_all()



@app.route('/exoplanets', methods=['GET'])
def get_exoplanets():
  print("3. Received GET request for exoplanets")

  exoplanets = Exoplanet.query.all()
  exoplanets_data = [{
    'id': exoplanet.id,
    'name': exoplanet.name,
    'hostname': exoplanet.hostname,
    'mass': exoplanet.pl_bmassj,
    'radius': exoplanet.pl_radj,
    'distance': exoplanet.st_dist,
    'discovery_date': exoplanet.pl_disc,
    'discovery_method': exoplanet.pl_discmethod,
    'discovery_facility': exoplanet.pl_facility,
    'equilibrium_temperature': exoplanet.pl_eqt,
    'discovery_reference': exoplanet.pl_disc_reflink,
    'planet_archive_url': exoplanet.pl_pelink,
    'exoplanet_eu_url': exoplanet.pl_edelink,
    'publication_date': exoplanet.pl_publ_date,
    'multiplanet_system': exoplanet.pl_mnum,
    'semi_major_axis': exoplanet.pl_orbsmax,
    'eccentricity': exoplanet.pl_orbeccen,
    'inclination': exoplanet.pl_orbincl,
    'orbital_period': exoplanet.pl_orbper,
    'orbital_period_error_min': exoplanet.pl_orbpererr1,
    'orbital_period_error_max': exoplanet.pl_orbpererr2,
    'equilibrium_temperature_error': exoplanet.pl_eqt,
    'density': exoplanet.pl_dens,
    'density_error_min': exoplanet.pl_denserr1,
    'density_error_max': exoplanet.pl_denserr2,
    'host_star_temperature': exoplanet.st_teff,
    'host_star_mass': exoplanet.st_mass,
    'host_star_radius': exoplanet.st_rad,
    'host_star_metallicity': exoplanet.st_met,
    'host_star_log_g': exoplanet.st_logg,
    'host_star_sp_type': exoplanet.st_spstr,
    'host_star_sp_type_extended': exoplanet.st_spt,
    'gaia_parallax': exoplanet.sy_plx,
    'gaia_parallax_error_min': exoplanet.sy_plxerr1,
    'gaia_parallax_error_max': exoplanet.sy_plxerr2,
    'gaia_distance': exoplanet.sy_dist,
    'gaia_distance_error_min': exoplanet.sy_disterr1,
    'gaia_distance_error_max': exoplanet.sy_disterr2,
    'gaia_g_mag': exoplanet.sy_gaiamag,
    'gaia_g_mag_error_min': exoplanet.sy_gaiamagerr1,
    'gaia_g_mag_error_max': exoplanet.sy_gaiamagerr2,
    'v_mag': exoplanet.sy_vmag,
    'v_mag_error_min': exoplanet.sy_vmagerr1,
    'v_mag_error_max': exoplanet.sy_vmagerr2,
    'has_imaging_data': exoplanet.sy_pnum > 0,
    'has_radial_velocity_data': exoplanet.pl_rvamp is not None,
    'has_transit_data': exoplanet.pl_trandep is not None
  } for exoplanet in exoplanets]

  print(exoplanets_data)
  return jsonify(exoplanets_data)


CORS_PROXY_URL = "https://leyber-cors-proxy-server.herokuapp.com/"
NASA_API_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+pscomppars"

@app.route('/update_exoplanets', methods=['POST'])
def update_exoplanets():
    fetch_and_update_exoplanets()
    return jsonify({'message': 'Exoplanets updated successfully'}), 200


def fetch_and_update_exoplanets():
  
    # The content of the original update_exoplanets function goes here, except the return statement.
    # The return statement is the content of the new update_exoplanets function.
  print("4. Received POST request for updating exoplanets")
  # Use the CORS proxy server to bypass CORS restrictions
  url = f"{CORS_PROXY_URL}{NASA_API_URL}"
  headers = {'origin': 'https://exomania-main.herokuapp.com','x-requested-with': 'exomania-main'}  # Replace 'your-app-name' with an appropriate name for your application

  response = requests.get(url, headers=headers)

  print("Status Code:", response.status_code)
  print("Response Content:", response.content)

  if response.status_code == 200:
    # Clear existing exoplanets from the database
    print("5. Successfully fetched data from NASA API")
    Exoplanet.query.delete()
    db.session.commit()
    print("6. Cleared existing exoplanets from the database")

    # Parse XML response and convert it to JSON
    root = ET.fromstring(response.content)
    exoplanets_data = bf.data(root)['{http://www.ivoa.net/xml/VOTable/v1.3}VOTABLE']['{http://www.ivoa.net/xml/VOTable/v1.3}RESOURCE']['{http://www.ivoa.net/xml/VOTable/v1.3}TABLE']['{http://www.ivoa.net/xml/VOTable/v1.3}DATA']['{http://www.ivoa.net/xml/VOTable/v1.3}TABLEDATA']['{http://www.ivoa.net/xml/VOTable/v1.3}TR']

    print("Exoplanets Data:", exoplanets_data)
    for exoplanet_data in exoplanets_data:
      print("Processing exoplanet data:", exoplanet_data)
      exoplanet_fields = [
        "name", "hostname", "pl_bmassj", "pl_radj", "st_dist", "pl_disc", "pl_discmethod", "pl_facility",
        "pl_eqt", "pl_disc_reflink", "pl_pelink", "pl_edelink", "pl_publ_date", "pl_mnum", "pl_orbsmax",
        "pl_orbeccen", "pl_orbincl", "pl_orbper", "pl_orblper", "pl_ratdor", "pl_ratdorerr1", "pl_ratdorerr2",
        "pl_rvamp", "pl_rvamperr1", "pl_rvamperr2", "pl_insol", "pl_trandep", "pl_trandeperr1", "pl_trandeperr2",
        "pl_imppar", "pl_impparerr1", "pl_impparerr2", "pl_orbsmaxerr1", "pl_orbsmaxerr2", "pl_orbeccenerr1",
        "pl_orbeccenerr2", "pl_orbinclerr1", "pl_orbinclerr2", "pl_orbpererr1", "pl_orbpererr2", "st_teff",
        "st_mass", "st_rad", "st_lum", "st_met", "st_logg", "st_spt", "sy_pnum", "sy_mnum", "sy_plx",
        "sy_plxerr1", "sy_plxerr2", "sy_dist", "sy_disterr1", "sy_disterr2", "sy_gaiamag", "sy_gaiamagerr1",
        "sy_gaiamagerr2", "sy_vmag", "sy_vmagerr1", "sy_vmagerr2", "pl_dens", "pl_denserr1", "pl_denserr2"
        ]

      exoplanet = Exoplanet(**{field: exoplanet_data[field] for field in exoplanet_fields})


      db.session.add(exoplanet)
      db.session.commit()
      print("Exoplanet added:", exoplanet.name)
  else:
      print("Failed to fetch data from NASA API")




if __name__ == "__main__":
  print("2. Starting Flask app")
  app.run(debug=True)


