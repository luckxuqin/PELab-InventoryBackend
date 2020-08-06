var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite" 


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
    }
})

createVcf = 'Create Table vcf(\
 Vcf_ID INTEGER PRIMARY KEY,\
 Name TEXT UNIQUE,\
 SDDC TEXT,\
 Username TEXT,\
 Password TEXT,\
 Owner TEXT,\
);'

createDomain = 'Create Table domain(\
  Domain_ID INTEGER PRIMARY KEY,\
  Name TEXT,\
  Vcf TEXT,\
  Cluster_Num TEXT,\
  Type TEXT,\
  FOREIGN KEY(vcf) REFERENCES vcf(Name)\
);'

createDomain = 'Create Table cluster(\
  Cluster_ID INTEGER PRIMARY KEY,\
  Name TEXT,\
  Vcf TEXT,\
  Domain TEXT,\
  Host_Num TEXT,\
  FOREIGN KEY(vcf) REFERENCES vcf(Name),\
  FOREIGN KEY(domain) REFERENCES domain(Name)\
);'


module.exports = db

