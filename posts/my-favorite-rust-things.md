---
title: My Favorite Rust Things
tags: post
date: 2019-05-25 16:20:00Z
linkClass: blue link hover-light-pink
layout: layouts/post.njk
---

These are my favorite Rust things. In no particular order.

* Immutable variables by default
* Cargo
* Documentation
* Compiler errors
* WebAssembly

## Immutable Variables by Default

You have to tell the compiler that a variable is mutable by using `mut`.

```rust
let num = 420;
num = 421; // nope
```

If you try and do this the compiler will let you know that you cannot reassign the variable.

Instead you can do this:

```rust
let mut num = 420;
num = 421; // yep!
```

## Cargo

Cargo is the super rad package manager that allows you to compile, run tests, create documentation, install binaries from <a href="https://crates.io/" class="{{linkClass}}">crates.io</a>, and manage your dependencies in your package.

A couple weeks ago I learned that you can install <a class="{{linkClass}}" href="https://github.com/killercup/cargo-edit">`cargo-edit`</a> and manage your dependencies similar to how you would with `npm`. It allows you to do things like:

```bash
cargo add diesel
```

Then it will automatically add it to your `Cargo.toml` file. Pretty cool.

## Documentation

The official documentation in Rust is amazing. It is rad to see first class documentation, and it is easier to create first class documentation with <a href="https://doc.rust-lang.org/rustdoc/" class="{{linkClass}}">`rustdoc`</a>. It is very nice to be able to write docs in code. `cargo doc` does a great job of just setting some defaults and running `rustdoc` for you. The docs produced are pretty helpful.

## Compiler Errors

The compiler errors can be annoying at first. After a while though they are pretty great. They are often very helpful and can tell you almost exactly what you are doing wrong. I'm still getting a tiny bit annoyed at borrowing and lifetime errors, but I expect once I get a better hang of those they will be better.

## WebAssembly

Rust supports WebAssembly as a compile target. This means we can get Rust code running in browsers!

There is a great little book <a href="https://rustwasm.github.io/docs/book/" class="{{linkClass}}">Rust 🦀 and WebAssembly 🕸</a> that goes into detail. You end up building _Conway's Game of Life_ in Rust and compiling down to `wasm`. Then you can load it up with some js.

I've only done that much with this, but thinking about the possibilities is pretty exciting.

Going to end there for now. There are a lot more things I like.
