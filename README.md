# Calculator

A browser calculator built for The Odin Project's foundations course.

**[Live demo](https://mathyy1.github.io/calculator/)**

![Screenshot](screenshot.png);

## Features

- Four basic operations plus modulo
- Operator chaining (`5 + 3 * 2 =` evaluates left to right as you type)
- Full keyboard support (digits, operators, Enter, Escape, Backspace)
- Graceful divide-by-zero handling
- Decimal input with single-dot enforcement per number
- Operator swap before committing (`5 + -` changes `+` to `-`)
- Post-equals chaining (press an operator after `=` to continue with the result)

## What I learned

**State modeling.** My first pass had seven state flags that all had to stay in
sync by hand. It was fragile. Deleting characters, chaining operators, and
decimal handling all drifted out of sync in different ways. The refactor cut
this to four variables (`num1`, `operator`, `num2`, `isError`) plus one
behavior flag (`lastActionWasEquals`) for post-equals digit replacement.
Everything else is derived at render time.

**Separation of concerns.** `operate(op, a, b)` is a pure function that takes
two numbers and an operator and returns a number. `handleEquals` is the glue
that reads state, calls `operate`, and writes the result back. Handlers never
touch the display directly. A single `render()` function reads state and
updates the DOM.

**Event delegation.** One click listener on the parent element reads
`data-action` and `data-value` attributes to route to the right handler. This
meant keyboard support dropped in with almost no changes, since both input
paths converge on the same handlers.

## Built with

Vanilla HTML, CSS, and JavaScript.