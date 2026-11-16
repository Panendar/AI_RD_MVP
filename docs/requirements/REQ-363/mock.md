# REQ-363 mock: Upload JSON

```
[ Upload JSON ] -> choose file -> schema check
                                    |
                 +------------------+------------------+
                 | valid                               | invalid
                 v                                     v
   +-----------------------------+     +-----------------------------------+
   | 2D plan shows the same      |     | ! This file is not a valid design |
   | design that was downloaded; |     |   (clear reason)          [ OK ]  |
   | edit / add from catalog     |     +-----------------------------------+
   +-----------------------------+       current design unchanged
```
