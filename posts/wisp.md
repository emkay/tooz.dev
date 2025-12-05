---
title: Wisp
tags: post
date: 2025-12-02 16:20:00Z
linkClass: blue link hover-light-pink
layout: layouts/post.njk
---

I've decided to participate in the <a class="blue link hover-light-pink" href="https://itch.io/jam/langjamgamejam">Langjam Gamejam</a> coming up in a couple weeks.

> Langjam Gamejam is a 7-day challenge to create a programming language and then use that language to build a game.

Seven days to build a language _and_ a game. It's ambitious, but I think I can make something work if I stay focused and keep both pieces minimal.

The language will be called **Wisp**.

Below are some ideas on how this whole thing will work and how I'll be able to use it to build the game.

## Why Scheme?

The plan is to make Wisp a <a class="blue link hover-light-pink" href="https://en.wikipedia.org/wiki/Scheme_(programming_language)">Scheme</a>-like language. Scheme uses <a class="blue link hover-light-pink" href="https://en.wikipedia.org/wiki/S-expression">S-expressions</a> for both code and data and they are enclosed in "()". You end up looking for a "(" and a ")" and know the middle part is the thing you want to evaluate.

## What Wisp Looks Like

At its core, Wisp is simple. Expressions are either values or lists:

```scheme
;; Values
42
3.14
"hello"
true
nil

;; Lists — first element is the function, rest are arguments
(+ 1 2 3)           ; => 6
(* 2 (+ 3 4))       ; => 14
(> 10 5)            ; => true
```

Variables and functions use `define`:

```scheme
(define x 5)
(define y 10)

(define (square n)
  (* n n))

(square 4)          ; => 16
```

Conditionals use `if` for simple branches and `cond` for multiple cases:

```scheme
(if (> x 10)
    "big"
    "small")

(cond
  ((= direction 'north) "You head north.")
  ((= direction 'south) "You head south.")
  (else "You can't go that way."))
```

Local bindings use `let`:

```scheme
(let ((x 10)
      (y 20))
  (+ x y))          ; => 30
```

Functions are first-class. Closures capture their environment:

```scheme
(define (make-counter)
  (let ((n 0))
    (fn ()
      (set! n (+ n 1))
      n)))

(define counter (make-counter))
(counter)           ; => 1
(counter)           ; => 2
(counter)           ; => 3
```

That's most of the language. Small, but enough to build a game.

## What Wisp Is For

Wisp isn't a general-purpose language. It's a game scripting language.

The interpreter, written in Rust with <a class="blue link hover-light-pink" href="https://macroquad.rs/">macroquad</a>, owns the game loop. Every frame, it calls `update` for logic and `draw` for rendering. Wisp scripts just define those functions:

```scheme
(define player-x 5)
(define player-y 5)

(define (update)
  (if (key-pressed? 'left)  (set! player-x (- player-x 1)))
  (if (key-pressed? 'right) (set! player-x (+ player-x 1)))
  (if (key-pressed? 'up)    (set! player-y (- player-y 1)))
  (if (key-pressed? 'down)  (set! player-y (+ player-y 1))))

(define (draw)
  (clear color-void)
  (draw-tile player-x player-y "@" color-gold color-void))
```

Games are just folders of `.wisp` files. To run one:

```bash
wisp main.wisp
```

Edit the scripts, re-run, see changes. No recompiling. The game is just data that Wisp interprets.
