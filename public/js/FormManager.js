var FormManager = (function() {
  
  //Classes
  function BulletList(list, placeholder) {
    var add;
    
    var removeItem = function(evt) {
      var item = this.parentNode;
      item.classList.add("deleting");

      var timer = setTimeout(function() {
        list.removeChild(item);
      }, 420);
    };
    
    this.addItem = function(str) {
      list.removeChild(add);
      
      list.innerHTML+='<li>\
                       &bull; <input type="text" value="' + (str?str:"") + '" placeholder="' + (placeholder?placeholder:"") + '" />\
                       <div class="remove"><i class="fa fa-times"></i></div>\
                       </li>';
      
      list.getElementsByClassName("remove")[list.getElementsByClassName("remove").length-1].addEventListener("click", removeItem);
      
      list.appendChild(add);
    }
    
    list.innerHTML += '<ul class="add">+</ul>';
    add = list.getElementsByClassName("add")[0];
    add.addEventListener("click", function() {
      this.addItem();
    }.bind(this));
    
  }
  
  function ItemsList(className, defaults, labels, extras, container, add) {
    var removeItem = function(evt) {
      var item = this.parentNode;
      item.classList.add("deleting");

      var timer = setTimeout(function() {
        container.removeChild(item);
      }, 420);
    };

    this.addItem = function(item) {
      item = item || {};
      

      container.removeChild(add);

      var itemDiv = document.createElement("div");
      itemDiv.className = className;

      itemDiv.innerHTML += '<div class="remove"><i class="fa fa-times"></i></div>';
      
      var section = (extras ? document.createElement("div") : itemDiv);
      if (extras) {
        section.classList.add("half");
        itemDiv.appendChild(section);
      }
      
      for (var key in defaults) {
        if (defaults.hasOwnProperty(key)) {
          if (className.indexOf("object") != -1) {
            section.innerHTML += '<div class="input labeled">\
                                  <label>' + (labels.hasOwnProperty(key)?labels[key]:"") + '</label>\
                                  <input type="text" class="' + key + '" value="' + (item.hasOwnProperty(key)?item[key]:"") + '" placeholder="' + defaults[key] + '" />\
                                  </div>';
          } else {
            section.innerHTML += '<div class="input"><input type="text" class="' + key + '" value="' + (item.hasOwnProperty(key)?item[key]:"") + '" placeholder="' + defaults[key] + '" /></div>';
          }
        }
      }
      
      if (extras) {
        var section2 = document.createElement("div");
        section2.classList.add("half");
        itemDiv.appendChild(section);
        
        for (var key in extras) {
          if (key=="bulletList") {
            section2.innerHTML += '<h3>' + extras[key]["header"] + '</h3>';
            
            var listUl = document.createElement("ul");
            var list = new BulletList(listUl, extras["bulletList"]["placeholder"]);
            
            if (item.hasOwnProperty(extras["bulletList"]["property"])) {
              item[extras["bulletList"]["property"]].forEach(list.addItem);
            }
            
            section2.appendChild(listUl);
          }
        }
        
        itemDiv.appendChild(section2);
      }
      
      itemDiv.getElementsByClassName("remove")[0].addEventListener("click", removeItem);

      container.appendChild(itemDiv);
      container.appendChild(add);
    };

    add.addEventListener("click", function() {
      this.addItem();
    }.bind(this));
  }
  
  
  
  //Functions
  
  var f= {};
  
  var profiles, add;
  
  f.element = function(el) {
    return document.getElementById(el);
  };
  
  
  
  f.init = function(json) {
    
    //Initialize forms
    profiles = new ItemsList("item", {
      "network": "Network",
      "url": "URL"
    }, {}, {}, f.element("profiles"), f.element("profiles").getElementsByClassName("add")[0]);
    
    work = new ItemsList("item object", {
      "company": "CVPress",
      "position": "Developer",
      "website": "www.google.com",
      "startDate": "September 19, 2014",
      "endDate": "September 21, 2014",
      "summary": "A resume creation tool"
    }, {
      "company": "Company",
      "position": "Position",
      "website": "Website",
      "startDate": "Start date",
      "endDate": "End date",
      "summary": "Summary"
    }, {
      "bulletList": {
        "property": "highlights",
        "header": "Highlights",
        "placeholder": "Cool skill used"
      }
    }, f.element("work"), f.element("work").getElementsByClassName("add")[0]);
    
    
    //Fill forms
    if (json.basics) {
      if (json.basics.name) {
        f.element("name").value = json.basics.name;
      }
      if (json.basics.email) {
        f.element("email").value = json.basics.email;
      }
      if (json.basics.phone) {
        f.element("phone").value = json.basics.phone;
      }
      if (json.basics.website) {
        f.element("website").value = json.basics.website;
      }
      if (json.basics.profiles) {
        json.basics.profiles.forEach(profiles.addItem);
      }
      if (json.basics.location.address) {
        f.element("address").value = json.basics.location.address;
      }
      if (json.basics.location.postalCode) {
        f.element("postalCode").value = json.basics.location.postalCode;
      }
      if (json.basics.location.location) {
        f.element("location").value = json.basics.location.location;
      }
    }
    
    if (json.work) {
      json.work.forEach(work.addItem);
    }
  };
  
  return f;
  
}());


window.addEventListener("load", function() {
  FormManager.init({
    "basics": {
      "name": "John Doe",
      "email": "test@test.com",
      "phone": "(555) 555-5555",
      "website": "johndoe.com",
      "location": {
        "address": "123 Road Rd.",
        "postalCode": "1O1 O1O",
        "location": "Townville, ON, Canada"
      },
      "profiles": [{
          "network": "GitHub",
          "username": "johndoe",
          "url": "github.com/johndoe"
        },
        {
          "network": "LinkedIn",
          "username": "johndoe",
          "url": "linkedin.com/johndoe"
        }
      ]
    },
    "work": [{
      "company": "CVPress",
      "position": "Developer",
      "website": "www.google.com",
      "startDate": "September 19, 2014",
      "endDate": "September 21, 2014",
      "summary": "A resume creation tool",
      "highlights": [
        "UI design",
        "Node.js stuff"
      ]
    }]
  });
});