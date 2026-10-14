const u = (slug) => `https://unsplash.com/photos/${slug}`

// All photos: Unsplash License (free to use, attribution appreciated). IDs verified against each photo page.
export const PHOTOS = {
  rope: { src: '/images/rope.jpg', alt: 'Athlete driving battle ropes under a concrete overpass', title: 'Battle ropes', by: 'Karsten Winegeart', href: u('0Wra5YYVQJE') },
  barbell: { src: '/images/barbell.jpg', alt: 'Barbell loaded with bumper plates on a gym floor', title: 'Barbell', by: 'Benjamin Brunner', href: u('wcOGQeT1jIw') },
  plank: { src: '/images/plank.jpg', alt: 'Athlete holding the top of a push-up in a dark gym', title: 'Push-up position', by: 'Gordon Cowie', href: u('ISg1JhN_vFk') },
  lifter: { src: '/images/lifter.jpg', alt: 'Lifter locking a plate onto a barbell', title: 'Loading the bar', by: 'Victor Freitas', href: u('KIzBvHNe7hY') },
}

/** Photos are forced to monochrome so they sit inside the black / smoke / white palette. */
export function Photo({ name, className = '', pos = 'center' }) {
  const p = PHOTOS[name]
  return <img src={p.src} alt={p.alt} loading="lazy" style={{ objectPosition: pos }} className={`object-cover grayscale contrast-125 brightness-75 ${className}`} />
}
