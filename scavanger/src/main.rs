#[allow(unused)]
extern crate dialoguer;
extern crate console;
mod base;

use std::env;
use std::fs;
use std::fs::File;
use std::io::prelude::*;
use dialoguer::Select;
use base::{CONFIGJS, CONFIGTS, MANIFEST};
use console::Term;
use std::path::Path;

fn main() {
  let args: Vec<String> = env::args().collect();
  if args.len() == 1 {
    println!("Enter valid keys");
  } else {
    let key = &args[1];
    execute(key);
  }
  // let filename = &args[2];
  // let mut dir = env::current_dir().unwrap();
}

fn execute(key: &str) {
  match key {
    "init" => {
      println!("Creating config...");
      println!("Write your own template! Then execute command <build>");
      create_file("template.cfg").expect("Something went wrong while creating config...");
      println!("Completed successfully!");
    },
    "build" => {
      let mut paths: Vec<String> = vec![];
      println!("Building...");
      build(&mut paths);
      println!("Complted successfully!");
      println!("Paths:");
      for i in paths {
        println!("    {}", i);
      }
    },
    "pwa" => {
      println!("Choose language:");
      let mut prompt = Select::new(); 
      let options: [&str; 2] = ["TS", "JS"];
      prompt.items(&options);
      prompt.default(0);
      let result = prompt.interact();
      let option = options[result.unwrap()];
      let term = Term::stdout();
      term.move_cursor_up(1).expect("Cursor moving error");
      term.clear_line().expect("Failed to clear line");
      println!("Chosen language: {}", option);
      create_file("template.cfg").expect("Something went wrong while creating config...");
      if option == "TS" {
        println!("Creating PWA template for TS...");
        write_to_file("template.cfg", CONFIGTS).expect("Something went wrong while creating config...");
      } else if option == "JS" {
        println!("Creating PWA template for JS...");
        write_to_file("template.cfg", CONFIGJS).expect("Something went wrong while creating config...");
      };
      let mut paths: Vec<String> = vec![];
      build(&mut paths);
      write_to_file("static/manifest.json", MANIFEST).expect("Failed to generate manifest.json");
      println!("Complited successfully!");
    },
    "help" => {
      let help: [&str; 4] = [
        "    init - creating config where you can create your own template",
        "    build - reading your config and creating your template",
        "    pwa - creating prepared template for PWA project",
        "    help - calling for some help"];
      println!("Current commands:");
      for command in &help {
        println!("{}", command);
      }
    },
    _ => println!("Wrong key")
  }
}

fn create_file(name: &str) -> std::io::Result<()> {
  if !Path::new(name).exists() {
    File::create(name)?;
  }
  Ok(())
}

fn create_folder(name: &str) -> std::io::Result<()> {
  if !Path::new(name).exists() {
    fs::create_dir(name)?;
  }
  Ok(())
}

fn write_to_file(name: &str, content: &str) -> std::io::Result<()> {
  let mut file = File::create(&name)?;
  file.write_all(content.as_bytes())?;
  Ok(())
}

fn split_by_rules(s: &str) -> Vec<&str> {
  let mut balancer = 0;
  let mut v = vec![];
  let mut r = vec![];
  for i in s.char_indices() {
    if i.1 == '}' {
      balancer = balancer - 1;
    }
    if balancer == 0 && i.1 == ',' {
      v.push(i.0);
    }
    if i.1 == '{' {
      balancer = balancer + 1;
    }
  }
  for i in 0..v.len() {
    let end = v[i];
    if i == 0 {
      r.push(&s[..end]);
    } else {
      let start = v[i-1];
      r.push(&s[start+1..end]);
    }
    if i == v.len()-1 { 
      r.push(&s[end+1..]);
    }
  }
  if v.len() == 0 {
    r.push(s);
  }
  r
}

fn realise_tree(splitted: &Vec<&str>, root: String, paths: &mut Vec<String>) {
  for i in splitted { 
    if !i.contains("{") {
      let path = format!("{}{}", root, i);
      paths.push(path.clone());
      create_file(&path).expect("Something went wrong while creating a file...");
    } else {
      let start = i.find("{").unwrap();
      let end = i.rfind("}").unwrap();
      let name = format!("{}/", &i[..start]);
      let value = &i[start+1..end];
      let sbr: Vec<&str> = split_by_rules(value);
      let path = format!("{}{}", root, name);
      paths.push(path.clone());
      create_folder(&path).expect("Something went wrong while creating a folder...");
      realise_tree(&sbr, path, paths);
    }
  }
}

fn build(paths: &mut Vec<String>) {
  let content = fs::read_to_string("template.cfg")
      .expect("Something went wrong reading the file").replace(&['\r', '\n', ' '][..], "");
  let mut items: Vec<&str> = content.split(';').collect();
  items.remove(items.len() - 1);
  realise_tree(&items, String::from(""), paths);
}