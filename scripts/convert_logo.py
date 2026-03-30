import cairosvg
cairosvg.svg2png(url='public/logo.svg', write_to='public/logo.png', output_width=512, output_height=512)
print('created public/logo.png')
