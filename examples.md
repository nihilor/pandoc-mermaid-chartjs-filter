# Examples

Creates the example images using pandoc and the pandoc-mermaid-chartjs-filter.

```{.mermaid filename="example-mermaid.png"}
sequenceDiagram
    Alice->>+John: Hello John, how are you?
    Alice->>+John: John, can you hear me?
    John-->>-Alice: Hi Alice, I can hear you!
    John-->>-Alice: I feel great!
```

```{.chartjs  filename="example-chartjs.png"}
type: bar
data:
  labels:
  - Red
  - Blue
  - Yellow
  - Green
  - Purple
  - Orange
  datasets:
  - label: "# of Votes"
    data:
    - 12
    - 19
    - 3
    - 5
    - 2
    - 12
    borderWidth: 0
options:
  font:
    family: "'IBM Plex Serif Light', serif"
  scales:
    y:
      beginAtZero: true
      grid:
        display: false
    x:
      grid:
        display: false
  plugins:
    title:
      display: true
      text: "# OF VOTES"
      font:
        family: "'Source Code Variable', 'IBM Plex Mono', monospace"
        size: 32
        weight: 500
    legend:
      display: false
      labels:
        font:
          family: "'Source Code Variable', 'IBM Plex Mono', monospace"
```