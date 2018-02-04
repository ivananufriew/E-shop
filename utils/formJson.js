function formJson(Obj) {

  let readyJSON = [];

  function search(argument, arr) {
    for(let entry of arr) {
      if(entry.Id == argument[0]) {
        entry.Previews.push(argument[1]);
        return true;
      }
    }
  }




  // если таковой айдишник есть, то просто дописываем данные из дублирующихся записей

  function formReadyJSON(args) {
    if(!search([args.id, args['model_previews.preview_url']], readyJSON)) {
      readyJSON.push({
        Id 		     	    : args.id,
        Brand_id        : args.brand_id,
        Brand           : args.brand_title,
        Name 		        : args.name,
        Rate            : args.rate,
        Description     : args.description,
        Available 	    : args.available == 1 ? true : false,
        Price 		      : args.price,
        Previews	      : [args['model_previews.preview_url']],
        Params : {
          FM 			        : args['params_list.FM'] == 1 ? true : false,
          WiFi		        : args['params_list.WiFi'] == 1 ? true : false,
          OS			        : args['params_list.OS'],
          RAM			        : args['params_list.RAM'],
          ROM			        : args['params_list.ROM'],
          Weight		      : args['params_list.Weight'],
          Display		      : {
            Type          : args['params_list.Display_type'],
            Diagonal      : args['params_list.Display_diagonal'],
            Resolution    : args['params_list.Display_resolution']
          },
          Power           : {
            Type          : args['params_list.Power_type'],
            Battery_type    : args['params_list.Battery_type'],
            Battery_capacity: args['params_list.Battery_capacity']
          },
          Camers          : {
            Main    : {
              There_is     : args['params_list.Main_camera'] == 1 ? true : false,
              Megapixels   : args['params_list.Main_camera_MP']
            },
            Frontal : {
              There_is     : args['params_list.Front_camera'] == 1 ? true : false,
              Megapixels   : args['params_list.Front_camera_MP']
            }
          },
          Processor	      : {
            Model	          : args['params_list.Processor'],
            Number_of_cores : args['params_list.Processor_cores_count'],
            Processor_speed : args['params_list.Processor_speed']
          },
          Dimensions      : {
            Width           : args['params_list.Width'],
            Height          : args['params_list.Height'],
            Depth           : args['params_list.Depth'],
          }
        }
      });
    }
  }

  function JSONIterator(jsonObj) {
    for (let i of jsonObj) {
      formReadyJSON(i);
    }
    return readyJSON;
  }

  return JSONIterator(Obj);
}

module.exports = (data) => formJson(data);
