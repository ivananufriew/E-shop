const express       = require('express');
const Fs            = require('fs');
const Path          = require('path');
const Xml           = require('easyxml');
const Multer        = require('multer');
const Base64        = require('base-64');
const rightFormat   = require('../utils/formJson');
const Sequelize     = require('../utils/db.config')();
const Op            = Sequelize.Op;
const Router        = express.Router();


const dir = Path.join(__dirname, '../models');
const modelDir = Path.join(dir, "models.js");
const Model = Sequelize.import(modelDir);
const Params_list = Sequelize.import(Path.join(dir, "params_list.js"));
const Model_previews = Sequelize.import(Path.join(dir, "model_previews.js"));

Model.hasOne(Params_list, {foreignKey: 'model_id'});
Model.hasMany(Model_previews, {foreignKey: 'model_id'});
Params_list.belongsTo(Model, {foreignKey: 'model_id'});
Model_previews.belongsTo(Model, {foreignKey: 'model_id'});



const Storage = Multer.diskStorage({
  destination : function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename    : function(req, file, cb) {
    cb(null, Base64.encode(Math.random().toString(36)).substr(5, 17).replace(/(=|==)/g,'')+Path.extname(file.originalname));
  }
});

const Upload = Multer({storage: Storage});

const XML = new Xml({
  singularizeChildren: true,
  underscoreAttributes: true,
  rootElement: 'response',
  dateFormat: 'ISO',
  indent: 2,
  manifest: true
});




// Receive the list of goods

Router.get('/', (req, res) => {
  let format = req.query.format;
  Model.findAll({
  include : [Params_list,Model_previews],
  raw     : true
  }).then(data => {
    if(format == 'xml') {
      res.set('Content-Type', 'text/xml');
      res.send(XML.render(rightFormat(data)));
    }
    else {
      res.json(rightFormat(data));
    }
  }).catch((err) => {
    res.json({
      "error" : err
    });
    console.error(err);
  })
});



// Receive the goods by ID

Router.get('/:id(\\d+)', (req, res) => {
  let format  = req.query.format;
  let id      = req.params.id;
  Model.findAll({
  include : [Params_list,Model_previews],
  where: {id: id},
  raw     : true
}).then(data => {
  if(format == 'xml') {
    res.set('Content-Type', 'text/xml');
    res.send(XML.render(rightFormat(data)));
  }
  else {
    res.json(rightFormat(data));
  }
}).catch((err) => {
  res.json({
    "error" : err
  });
});
});


// Search the goods

Router.post('/search', (req, res) => {
  let brandsList = [];
  let diagonalsList = [];

  for(let [index,brand] of req.body.brands.entries()) {
    if(brand[index + 1] !== false) {
      brandsList.push(index+1);
    }
  }

  for(let [index,diagonal] of req.body.diagonals.entries()) {
    if(diagonal[Object.keys(diagonal).join("")] !== false) {
      diagonalsList.push(Object.keys(diagonal).join(""));
    }
  }


  // Conditions object
  let conditions = {
    include: [
      {
        model: Params_list,
        where: {
          Display_diagonal  : {
            [Op.in] : [diagonalsList]
          }
        }
      },
      {
        model: Model_previews
      },
    ],
    where: {
      name: {
        [Op.like] : `%${req.body.model}%`
      }
    },
    raw: true
  };

  // Add otional condtion - ONLY_AVAILABLE
  if(req.body.only_available == true) {
    conditions.where.Available = 1;
  }

  // Execute the Query
  Model.findAll(conditions).then(data => {
    res.json(rightFormat(data));
  })
  .catch(err => res.json(err));

});



Router.get("/getParams", (req,res) => {
  const key = req.query.key;
  switch (key) {
    case "display_diagonal":
      Params_list.findAll({
        attributes: ["Display_diagonal"],
        group: ["Display_diagonal"],
      }).then(data => {
        let arr = [];
        for(let i of data) {
          arr.push(parseFloat(i.Display_diagonal));
        }
        res.json(arr);
      })
      .catch(err=> res.json(err));
      break;

    case "display_resolution":
      Params_list.findAll({
        attributes: ["Display_resolution"],
        group: ["Display_resolution"],
      }).then(data => {
        res.json(data);
      })
      .catch(err=> res.json(err));
      break;

    case "display_type":
      Params_list.findAll({
        attributes: ["Display_type"],
        group: ["Display_type"],
      }).then(data => {
        res.json(data);
      })
      .catch(err=> res.json(err));
      break;


    case "ram":
      Params_list.findAll({
        attributes: ["RAM"],
        group: ["RAM"],
      }).then(data => {
        res.json(data);
      })
      .catch(err=> res.json(err));
      break;


      case "rom":
        Params_list.findAll({
          attributes: ["ROM"],
          group: ["ROM"],
        }).then(data => {
          res.json(data);
        })
        .catch(err=> res.json(err));
        break;


      case "fm":
        Params_list.findAll({
          attributes: ["FM"],
          group: ["FM"],
        }).then(data => {
          res.json(data);
        })
        .catch(err=> res.json(err));
        break;


      case "processor_cores":
        Params_list.findAll({
          attributes: ["Processor_cores_count"],
          group: ["Processor_cores_count"],
        }).then(data => {
          res.json(data);
        })
        .catch(err=> res.json(err));
        break;


      case "os":
        Params_list.findAll({
          attributes: ["OS"],
          group: ["OS"],
        }).then(data => {
          res.json(data);
        })
        .catch(err=> res.json(err));
        break;




    default:
    Params_list.findAll({
      attributes: ["Display_diagonal"],
      group: ["Display_diagonal"],
    }).then(data => {
      let arr = [];
      for(let i of data) {
        arr.push(parseFloat(i.Display_diagonal));
      }
      res.json(arr);
    })
    .catch(err=> res.json(err));

  }
});


// Add the goods
Router.post("/", Upload.single('preview'), (req,res) => {

  let obj = JSON.parse(req.body.json);

  let newModel = {
    name          : obj.Name,
    rate          : obj.Rate,
    price         : obj.Price,
    available     : obj.Available,
    phone_status  : obj.Status,
    description   : obj.Description,
    brand_id      : obj.Brand_id
  };

  Model.create(newModel)
  .then(() => console.info("model successfully created ."))
  .catch(err => res.json(err));

  let params = {
    model_id                : null,
    OS                      : obj.Params.OS,
    Power_type              : obj.Params.Power.Type,
    Battery_capacity        : obj.Params.Power.Battery_capacity,
    Battery_type            : obj.Params.Power.Battery_type,
    Width                   : obj.Params.Dimensions.Width,
    Height                  : obj.Params.Dimensions.Height,
    Depth                   : obj.Params.Dimensions.Depth,
    Weight                  : obj.Params.Weight,
    Main_camera             : obj.Params.Camers.Main.There_is,
    Main_camera_MP          : obj.Params.Camers.Main.Megapixels,
    Front_camera            : obj.Params.Camers.Frontal.There_is,
    Front_camera_MP         : obj.Params.Camers.Frontal.Megapixels,
    WiFi                    : obj.Params.WiFi,
    FM                      : obj.Params.FM,
    ROM                     : obj.Params.ROM,
    RAM                     : obj.Params.RAM,
    Processor               : obj.Params.Processor.Model,
    Processor_cores_count   : obj.Params.Processor.Number_of_cores,
    Processor_speed         : obj.Params.Processor.Speed,
    Display_diagonal        : obj.Params.Display.Diagonal,
    Display_resolution      : obj.Params.Display.Resolution,
    Display_type            : obj.Params.Display.Type
  };
  Model.count()
  .then((count) => {
    params.model_id = count+1;
    Params_list.create(params)
    .then(() => {
      console.info('\x1b[32m','Params successfully applied .');
      Model_previews.create({
        model_id    : count+1,
        preview_url : 'http://static.phones-shop.ga/'+req.file.path
      })
      .then(() => {
        console.info('\x1b[32m','Previews successfully applied .');
        console.info('\x1b[32m',`Phone ${obj.Name} succesfully added .`);
        res.send(201, { id: count+1 });
      })
      .catch(err => res.json(err));
    })
    .catch(err => {
      res.json(err);
      console.error(err);
    });
  });
});


// Update goods

Router.put('/:id(\\d+)', (req, res) => {
  res.status(200).send("Coming soon !");
});


module.exports = Router;
