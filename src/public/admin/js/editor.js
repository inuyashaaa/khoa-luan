CKEDITOR.replace('editor2')
CKEDITOR.stylesSet.add('default', [
  { name: 'Responsive', type: 'widget', widget: 'image', attributes: { 'class': 'img-responsive' } },
  { name: 'Responsive table', element: 'table', attributes: { 'class': 'table-responsive-custom' } },
  { name: 'Responsive video', element: 'div', attributes: { 'class': 'embed-responsive embed-responsive-16by9' } }
])
