pub const MANIFEST: &str = r#"{
  "short_name": "PWA",
  "name": "PWA",
  "icons": [
    {
      "src": "/favicon.png",
      "type": "image/png",
      "sizes": "128x128"
    },
    {
      "src": "/metarhia.png",
      "type": "image/png",
      "sizes": "256x256"
    }
  ],
  "start_url": "/",
  "background_color": "rgb(44,62,80)",
  "display": "standalone",
  "scope": "/",
  "theme_color": "rgb(236,240,241)"
}"#;

pub const CONFIGJS: &str = 
r#"lib {
  lib.js
};
server {
  server.js
};
static {
  assets {},
  css {
    style.css
  },
  less {
    style.less
  }, 
  js {
    client.js
  },
  favicon.ico,
  favicon.png,
  index.html,
  manifest.json,
  icon.png,
  worker.js
};"#;

pub const CONFIGTS: &str = 
r#"lib {
  lib.ts
};
server {
  server.ts
};
static {
  assets {},
  css {
    style.css
  },
  less {
    style.less
  }, 
  js {
    client.ts
  },
  favicon.ico,
  favicon.png,
  index.html,
  manifest.json,
  icon.png,
  worker.ts
};"#;

pub const TEST: &str = "
main.js;
a {
  b {
    c.ts,
    d.js,
    e.py,
    y {
      abc {

      },
      defc {
        
      }
    }, 
    f.txt,
    g {
      h.txt
    },
    z {
      kek {
        kek.a
      },
      bek {
        bak.a
      }
    }
  },
  i {
    j.ex,
    k.rs,
    x {

    }
  },
  kek.js
};";