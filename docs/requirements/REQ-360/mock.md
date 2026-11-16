# REQ-360 mock: Select and move

```
  +-------------------------------------+
  |                                     |
  |   #===========#                     |
  |   #  item     #  -- drag -->  [ ]   |   # = selected outline
  |   #===========#                     |
  |                                     |
  |                       wall stops ---|-> item cannot pass
  +-------------------------------------+

Flow: click item -> selected -> drag -> position kept inside walls
      -> room JSON position updated at once
```
