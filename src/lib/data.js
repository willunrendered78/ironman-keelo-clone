export const GROUPS = ['push', 'pull', 'legs', 'core', 'cardio']
export const GROUP_LABEL = { push: 'Push', pull: 'Pull', legs: 'Legs', core: 'Core', cardio: 'Cardio' }

const WARM = {
  bw: ['400m jog or 60 jumping jacks', '10 arm circles each direction', '10 air squats', '10 inchworms', '30s plank hold'],
  gym: ['500m row or 3 min bike', '10 PVC pass-throughs', '10 goblet squats (light)', '10 band pull-aparts', '2 warm-up rounds of the first movements, light load'],
}

// m: movements. cx = complex movement -> shows silhouette. hl = highlighted muscle regions.
export const WORKOUTS = [
  { id: 'cinder', name: 'Cinder', type: 'AMRAP', minutes: 20, equipment: 'bodyweight', level: 'Benchmark', groups: ['push', 'legs', 'core'],
    desc: 'Twenty minutes. Three movements. Keep moving.', warmup: WARM.bw,
    m: [{ n: 'Push-ups', r: '5', cx: true, hl: ['shoulders', 'arms', 'core'] }, { n: 'Air squats', r: '10' }, { n: 'Sit-ups', r: '15' }] },
  { id: 'half-century', name: 'Half Century', type: 'FORTIME', rounds: 1, cap: 30, equipment: 'bodyweight', level: 'Benchmark', groups: ['legs', 'push', 'core', 'cardio'],
    desc: 'A descending chipper. 150 reps, no excuses.', warmup: WARM.bw,
    m: [{ n: 'Air squats', r: '50' }, { n: 'Sit-ups', r: '40' }, { n: 'Push-ups', r: '30', cx: true, hl: ['shoulders', 'arms', 'core'] }, { n: 'Walking lunges', r: '20' }, { n: 'Burpees', r: '10', cx: true, hl: ['shoulders', 'core', 'legs'] }] },
  { id: 'plank-forge', name: 'Plank Forge', type: 'AMRAP', minutes: 12, equipment: 'bodyweight', level: 'Intermediate', groups: ['core', 'push'],
    desc: 'Trunk under tension from the first second to the last.', warmup: WARM.bw,
    m: [{ n: 'Plank shoulder taps', r: '12', cx: true, hl: ['shoulders', 'core'] }, { n: 'Mountain climbers', r: '20', cx: true, hl: ['core', 'legs'] }, { n: 'Plank to push-up', r: '6', cx: true, hl: ['arms', 'shoulders', 'core'] }] },
  { id: 'hollow-sprint', name: 'Hollow Sprint', type: 'FORTIME', rounds: 4, cap: 25, equipment: 'bodyweight', level: 'Intermediate', groups: ['core', 'cardio'],
    desc: 'Four rounds. Abs first, lungs second.', warmup: WARM.bw,
    m: [{ n: 'Hollow rocks', r: '20', cx: true, hl: ['core'] }, { n: 'V-ups', r: '15' }, { n: 'Burpees', r: '10', cx: true, hl: ['shoulders', 'core', 'legs'] }] },
  { id: 'lower-pressure', name: 'Lower Pressure', type: 'AMRAP', minutes: 15, equipment: 'bodyweight', level: 'Intermediate', groups: ['legs', 'cardio'],
    desc: 'Legs on fire, lungs on borrowed time.', warmup: WARM.bw,
    m: [{ n: 'Jump squats', r: '15' }, { n: 'Reverse lunges', r: '10/side' }, { n: 'Glute bridges', r: '15', cx: true, hl: ['glutes', 'core'] }] },
  { id: 'pull-void', name: 'Pull Void', type: 'AMRAP', minutes: 10, equipment: 'bodyweight', level: 'Beginner', groups: ['pull', 'core'],
    desc: 'No bar? Pull with the floor and a towel.', warmup: WARM.bw,
    m: [{ n: 'Superman holds', r: '12', cx: true, hl: ['glutes', 'core'] }, { n: 'Towel rows (door)', r: '10' }, { n: 'Reverse snow angels', r: '12' }] },
  { id: 'thruster-ladder', name: 'Thruster Ladder', type: 'FORTIME', rounds: 3, cap: 15, equipment: 'gym', level: 'Benchmark', groups: ['legs', 'push', 'pull'],
    desc: '21-15-9. The classic couplet.', warmup: WARM.gym,
    m: [{ n: 'Thrusters 43kg', r: '21-15-9', cx: true, hl: ['shoulders', 'legs', 'core'] }, { n: 'Pull-ups', r: '21-15-9' }] },
  { id: 'deadlift-grind', name: 'Deadlift Grind', type: 'AMRAP', minutes: 15, equipment: 'gym', level: 'Intermediate', groups: ['legs', 'pull', 'cardio'],
    desc: 'Heavy hinge, hard swing, high jump.', warmup: WARM.gym,
    m: [{ n: 'Deadlifts 100kg', r: '5', cx: true, hl: ['glutes', 'core', 'legs'] }, { n: 'Kettlebell swings 24kg', r: '10' }, { n: 'Box jumps 60cm', r: '15' }] },
  { id: 'rower-burner', name: 'Rower Burner', type: 'FORTIME', rounds: 5, cap: 30, equipment: 'gym', level: 'Intermediate', groups: ['cardio', 'pull', 'core'],
    desc: 'Five rounds. Row hard, swing harder.', warmup: WARM.gym,
    m: [{ n: 'Row', r: '500m' }, { n: 'Kettlebell swings 24kg', r: '12' }, { n: 'Toes-to-bar', r: '8', cx: true, hl: ['core', 'shoulders'] }] },
  { id: 'pull-chipper', name: 'Pull Chipper', type: 'FORTIME', rounds: 1, cap: 35, equipment: 'gym', level: 'Advanced', groups: ['pull', 'core'],
    desc: 'Thirty of everything that pulls.', warmup: WARM.gym,
    m: [{ n: 'Pull-ups', r: '30' }, { n: 'Dumbbell rows 20kg', r: '30' }, { n: 'Ring rows', r: '30' }, { n: 'Hanging knee raises', r: '30', cx: true, hl: ['core'] }] },
  { id: 'press-pull', name: 'Press & Pull', type: 'AMRAP', minutes: 20, equipment: 'gym', level: 'Intermediate', groups: ['push', 'pull'],
    desc: 'Balance the upper body. Twenty minutes.', warmup: WARM.gym,
    m: [{ n: 'Strict press 40kg', r: '5', cx: true, hl: ['shoulders', 'arms', 'core'] }, { n: 'Pull-ups', r: '5' }, { n: 'Dumbbell snatch 22kg', r: '10' }] },
  { id: 'rope-intervals', name: 'Rope Intervals', type: 'AMRAP', minutes: 10, equipment: 'gym', level: 'Beginner', groups: ['cardio', 'push', 'core'],
    desc: 'Battle ropes and burpees. Short, vicious.', warmup: WARM.gym,
    m: [{ n: 'Battle rope slams', r: '20', cx: true, hl: ['shoulders', 'core', 'arms'] }, { n: 'Burpees', r: '8', cx: true, hl: ['shoulders', 'core', 'legs'] }] },
  { id: 'front-squat-engine', name: 'Front Squat Engine', type: 'AMRAP', minutes: 12, equipment: 'gym', level: 'Advanced', groups: ['legs', 'core'],
    desc: 'Rack position, upright torso, relentless.', warmup: WARM.gym,
    m: [{ n: 'Front squats 60kg', r: '6', cx: true, hl: ['legs', 'glutes', 'core'] }, { n: 'Walking lunges', r: '12' }, { n: 'Sit-ups', r: '12' }] },
]

export const getWorkout = (id) => WORKOUTS.find((w) => w.id === id)
export const accessible = (w, equipment) => equipment === 'gym' || w.equipment === 'bodyweight'

export const USERS = {
  me: { name: 'You', tag: 'YOU' },
  u2: { name: 'M. Okafor', tag: 'MO' },
  u3: { name: 'J. Brandt', tag: 'JB' },
  u4: { name: 'S. Vega', tag: 'SV' },
  u5: { name: 'T. Lindqvist', tag: 'TL' },
}

const H = 3600e3
export const seedPosts = () => {
  const now = Date.now()
  return [
    { id: 'p1', userId: 'u2', workoutId: 'cinder', ts: now - 2 * H, score: { rounds: 21, reps: 7 }, text: 'New PR. Lungs gone.', likes: ['u3'], comments: [{ id: 'c1', userId: 'u3', text: 'Animal.', ts: now - 1 * H }] },
    { id: 'p2', userId: 'u3', workoutId: 'thruster-ladder', ts: now - 9 * H, score: { seconds: 487 }, text: '', likes: [], comments: [] },
    { id: 'p3', userId: 'u4', workoutId: 'half-century', ts: now - 26 * H, score: { seconds: 1312 }, text: 'Slow but finished.', likes: ['u2', 'u5'], comments: [] },
    { id: 'p4', userId: 'u5', workoutId: 'deadlift-grind', ts: now - 50 * H, score: { rounds: 9, reps: 3 }, text: '', likes: [], comments: [] },
    { id: 'p5', userId: 'u2', workoutId: 'hollow-sprint', ts: now - 74 * H, score: { seconds: 904 }, text: 'Core is cooked.', likes: [], comments: [] },
  ]
}
