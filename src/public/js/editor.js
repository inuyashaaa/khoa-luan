CKEDITOR.replace('editor2')
CKEDITOR.stylesSet.add('default', [
  { name: 'Responsive', type: 'widget', widget: 'image', attributes: { 'class': 'responsive-img' } },
  { name: 'Responsive video', element: 'div', attributes: { 'class': 'video-container' } }
])
