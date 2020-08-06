var express = require("express")
var cors = require("cors")
var app = express()
var db = require("./database.js")
var md5 = require("md5")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/vcf", (req, res, next) => {
    var sql = "select * from vcf"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/domain/", (req, res, next) => {
    var sql = "select * from domain order by Type Asc"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/domain/:name/:type", (req, res, next) => {
    var sql = "select * from domain where Vcf=? AND Type=?"
    var params = [req.params.name, req.params.type]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/cluster/", (req, res, next) => {
    var sql = "select * from cluster"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/domain/:name", (req, res, next) => {
    var sql = "select * from domain where Vcf=?"
    var params = [req.params.name]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/cluster/:vcf/:domain", (req, res, next) => {
    var sql = "select * from cluster where Vcf=? AND Domain=?"
    var params = [req.params.vcf, req.params.domain]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/vcf/:name", (req, res, next) => {
    var sql = "select * from vcf where Name = ?"
    var params = [req.params.name]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "data":row
        })
      });
});


app.get("/api/hosts", (req, res, next) => {
    var sql = "select * from hosts"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/cores/:cores", (req, res, next) => {
    var sql = "select * from hosts where CPU_Cores>?"
    var params = [req.params.cores]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/filter/:cpucheck/:cores/:niccheck/:nic", (req, res, next) => {
    var sql = "select * from hosts where (CPU_Cores>? OR ?) AND ( rtrim(NIC_1_Speed,'Mbps') >= ? OR \
     rtrim(NIC_2_Speed,'Mbps') >= ? OR rtrim(NIC_3_Speed,'Mbps') >= ? OR rtrim(NIC_4_Speed,'Mbps') >= ? OR \
     rtrim(NIC_5_Speed,'Mbps') >= ? OR rtrim(NIC_6_Speed,'Mbps') >= ? OR ?)"
    var cores = req.params.cores;
    var nic = `${req.params.nic}000`;
    if(cores == "undefined") cores='0';
    var cpucheck = (req.params.cpucheck == 'true');
    var niccheck = (req.params.niccheck == 'true');
    var params = [cores, cpucheck, nic, nic, nic, nic, nic, nic, niccheck]
    console.log(params);
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/otherhosts", (req, res, next) => {
    var sql = "select * from hosts where VCF = ''"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/hosts/:name", (req, res, next) => {
    var sql = "select * from hosts where Hostname = ?"
    var params = [req.params.name]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "data":row
        })
      });
});

app.get("/api/host_by_domain/:name", (req, res, next) => {
    var sql = "select * from hosts where Domain = ?"
    var params = [req.params.name]
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "data":rows
        })
      });
});


app.get("/api/vlan", (req, res, next) => {
    var sql = "select * from vlan"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.put("/api/hosts", (req, res, next) => {
    var data ={
        Hostname : req.body.Hostname,
        HostIP : req.body.HostIP,
        Username : req.body.Username,
        Password : req.body.Password,
        ILOIP : req.body.ILOIP,
        ILOName : req.body.ILOName,
        ILOUser : req.body.ILOUser,
        ILOPassword : req.body.ILOPassword,
    };
    // console.log(data);
    var params = [ data.Hostname, data.Username, data.Password, data.ILOIP, data.ILOName,
        data.ILOUser, data.ILOPassword, data.HostIP];
    var sql = "UPDATE hosts SET Hostname = ?,\
                                Username = ?, Password=?,\
                                ILOIP = ?, ILOName = ?,\
                                ILOUser = ?, ILOPassword = ?\
                WHERE HostIP = ?";
    db.run(sql, params, function (err) {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "changes":this.changes,
        })
      });
});

app.put("/api/hostsvcf", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    var selectedHosts = req.body.selectedHosts;
    var updateinfo = req.body.updateinfo;
    var data ={
        Team : updateinfo.Team,
        AssignTo : updateinfo.AssignTo,
        TestBed : updateinfo.TestBed,
        StartDate : updateinfo.StartDate,
        EndDate: updateinfo.EndDate,
        IS_VCF : updateinfo.IS_VCF,
        VCF : updateinfo.VCF,
        Domain : updateinfo.Domain,
        Cluster : updateinfo.Cluster
    };
    // console.log(data);
    for(let host of selectedHosts){
        var params = [ data.Team, data.AssignTo, data.TestBed, data.StartDate, data.EndDate,
            data.IS_VCF, data.VCF, data.Domain, data.Cluster, host.HostIP];
        var sql = "UPDATE hosts SET Team = ?, AssignTo = ?,\
                                    TestBed = ?, StartDate = ?, EndDate = ?,\
                                    IS_VCF = ?, VCF = ?, Domain = ?, Cluster = ?\
                    WHERE HostIP = ?";
        db.run(sql, params, function (err) {
            if (err) {
                res.status(400).json({"error":err.message});
                return;
            }
            
        });
    }
    res.json({
        "message":"success",
    })
    /*var params = [ data.Hostname, data.Username, data.Password, data.ILOIP, data.ILOName,
        data.ILOUser, data.ILOPassword, data.Team, data.AssignTo, data.TestBed, data.StartDate, data.EndDate,
        data.IS_VCF, data.VCF, data.Domain, data.Cluster, data.HostIP];
    var sql = "UPDATE hosts SET Hostname = ?,\
                                Username = ?, Password=?,\
                                ILOIP = ?, ILOName = ?,\
                                ILOUser = ?, ILOPassword = ?,\
                                Team = ?, AssignTo = ?,\
                                TestBed = ?, StartDate = ?, EndDate = ?,\
                                IS_VCF = ?, VCF = ?, Domain = ?, Cluster = ?\
                WHERE HostIP = ?";
    db.run(sql, params, function (err) {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message":"success",
            "changes":this.changes,
        })
      });*/
});

app.post("/api/vcf/", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    var error_flag = false;
    var errors=[]
    var vcf = req.body.VCFinfo;
    if (!vcf.Name){
        errors.push("No VCF Name specified");
    }
    if (!vcf.SDDC){
        errors.push("No SDDC specified");
    }
    console.log(vcf);
    if(vcf.Vcf_ID == ''){
        var sql_vcf_insert= 'INSERT INTO vcf (Name,SDDC,Username,Password,Owner) VALUES (?,?,?,?,?)';
        var params_vcf_insert = [vcf.Name, vcf.SDDC, vcf.Username, vcf.Password, vcf.Owner];
        db.run(sql_vcf_insert, params_vcf_insert, function (err) {
            if (err) {
                errors.push(err.message);
                error_flag=true;
                // return;
            }
            
        });
    }else {
        var sql_vcf_update= 'UPDATE vcf SET Name = ?, SDDC = ? ,Username = ?, Password = ?,Owner = ?\
                        WHERE Vcf_ID = ?';
        var params_vcf_update = [vcf.Name, vcf.SDDC, vcf.Username, vcf.Password, vcf.Owner, vcf.Vcf_ID];
        db.run(sql_vcf_update, params_vcf_update, function (err) {
            if (err) {
                errors.push(err.message);
                error_flag=true;
                // return;
            }
        });
    }
    var domains = req.body.Domains;
    for(let domain of domains){
        console.log(domain);
        if (domain.Domain_ID ==0){
            var sql_domain_insert ='INSERT INTO domain (Domain_Name, Vcf, Cluster_Num, Type) VALUES(?,?,?,?)';
            var params_domain_insert = [domain.Domain_Name, vcf.Name, domain.Cluster_Num, domain.Type];
            db.run(sql_domain_insert, params_domain_insert, function (err) {
                if (err) {
                    errors.push(err.message);
                    error_flag=true;
                    
                    // return;
                }

            });
        } else {
            var sql_domain_update ='UPDATE domain SET Domain_Name = ?, Vcf= ?, Cluster_Num = ?, Type = ? WHERE Domain_ID = ?';
            var params_domain_update = [domain.Domain_Name, vcf.Name, domain.Cluster_Num, domain.Type, domain.Domain_ID];
            db.run(sql_domain_update, params_domain_update, function (err) {
                if (err) {
                    errors.push(err.message);
                    error_flag=true;
                    // return;
                }
            });
        }
        for (let cluster of domain.clusters){
            console.log(cluster);
            if (cluster.Cluster_ID ==0){
                var sql_cluster_insert ='INSERT INTO cluster (Cluster_Name, Vcf, Domain) VALUES(?,?,?)';
                var params_cluster_insert = [cluster.Cluster_Name, vcf.Name, domain.Domain_Name];
                db.run(sql_cluster_insert, params_cluster_insert, function (err) {
                    if (err) {
                        errors.push(err.message);
                        error_flag=true;
                        // return;
                    }
                });
            } else {
                var sql_cluster_update ='UPDATE cluster SET Cluster_Name = ? WHERE Cluster_ID = ?';
                var params_cluster_update = [cluster.Cluster_Name, cluster.Cluster_ID];
                db.run(sql_cluster_update, params_cluster_update, function (err) {
                    if (err) {
                        errors.push(err.message);
                        error_flag=true;
                        // return;
                    }
                });
            }
        }
    };
    setTimeout(() => { 
        if(!error_flag){
            return res.status(200).json({
                    "message":"success",
                })
        }else{
            return res.status(400).json({"error":errors.join(",")});
        };
    }, 2000);
    
    /*var sql ='INSERT INTO vcf (VCF,SDDC,Username,Password,Owner, \
        Management_Domain,Mgmt_Num_Cluster,Mgmt_Num_Host,Mgmt_Cluster_1, \
        Mgmt_Cluster_2,Mgmt_Cluster_3,Mgmt_Cluster_4,\
        Workload_Domain_1,Wkld1_Num_Cluster,Wkld1_Num_Host,Wkld1_Cluster_1,Wkld1_Cluster_2,Wkld1_Cluster_3,Wkld1_Cluster_4,\
        Workload_Domain_2,Wkld2_Num_Cluster,Wkld2_Num_Host,Wkld2_Cluster_1,Wkld2_Cluster_2,Wkld2_Cluster_3,Wkld2_Cluster_4,\
        Workload_Domain_3,Wkld3_Num_Cluster,Wkld3_Num_Host,Wkld3_Cluster_1,Wkld3_Cluster_2,Wkld3_Cluster_3,Wkld3_Cluster_4,\
        Workload_Domain_4,Wkld4_Num_Cluster,Wkld4_Num_Host,Wkld4_Cluster_1,Wkld4_Cluster_2,Wkld4_Cluster_3,Wkld4_Cluster_4)\
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)\
        ON CONFLICT(VCF) DO UPDATE SET SDDC=excluded.SDDC, Username=excluded.SDDC, Password=excluded.Password, Owner=excluded.Owner,\
        '
    var params =[data.vcf_name, data.SDDC, data.username, data.password, data.owner,
        data.management_domain, data.mgmt_num_cluster, data.mgmt_num_host, data.mgmt_cluster_1, data.mgmt_cluster_2, data.mgmt_cluster_3, data.mgmt_cluster_4,
        data.workload_domain_1, data.wkld1_num_cluster, data.wkld1_num_host, data.wkld1_cluster_1, data.wkld1_cluster_2, data.wkld1_cluster_3, data.wkld1_cluster_4,
        data.workload_domain_2, data.wkld2_num_cluster, data.wkld2_num_host, data.wkld2_cluster_1, data.wkld2_cluster_2, data.wkld2_cluster_3, data.wkld2_cluster_4,
        data.workload_domain_3, data.wkld3_num_cluster, data.wkld3_num_host, data.wkld3_cluster_1, data.wkld3_cluster_2, data.wkld3_cluster_3, data.wkld3_cluster_4,
        data.workload_domain_4, data.wkld4_num_cluster, data.wkld4_num_host, data.wkld4_cluster_1, data.wkld4_cluster_2, data.wkld4_cluster_3, data.wkld4_cluster_4];
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });*/
})



app.patch("/api/user/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : undefined
    }
    db.run(
        `UPDATE user set 
           name = coalesce(?,name), 
           email = COALESCE(?,email), 
           password = coalesce(?,password) 
           WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        (err, result) => {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.header("Access-Control-Allow-Origin", "*");
            res.json({
                message: "success",
                data: data
            })
    });
})


app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.header("Access-Control-Allow-Origin", "*");
            res.json({"message":"deleted", rows: this.changes})
    });
})


// Root path
app.get("/", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.json({"message":"Ok"})
});

