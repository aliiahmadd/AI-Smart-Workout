/*
# Seed exercise library

1. Purpose
- Populate the `exercises` table with a curated set of exercises across categories so the Workout Library and AI Generator have real content to show.
- Uses ON CONFLICT DO NOTHING so it is safe to re-run.
*/

INSERT INTO exercises (name, category, difficulty, target_muscle, calories, equipment, duration_min, instructions, image_url, video_url, ai_tip)
VALUES
('Barbell Bench Press','Chest','Intermediate','Chest',90,'Barbell',15,'Lie on a flat bench, grip the bar slightly wider than shoulders, lower to mid-chest, press up.','https://images.pexels.com/photos/19545238/pexels-photo-19545238.jpeg','https://www.youtube.com/watch?v=rT7DgCs-3jk','Keep shoulder blades retracted and feet planted for stability.'),
('Incline Dumbbell Press','Chest','Beginner','Upper Chest',70,'Dumbbells',12,'Set bench to 30°, press dumbbells up and slightly together, lower with control.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Drive through the heels and avoid arching the lower back.'),
('Push-Ups','Chest','Beginner','Chest',50,'Bodyweight',8,'Hands shoulder-width, body straight, lower chest to floor, push up.','https://images.pexels.com/photos/4761351/pexels-photo-4761351.jpeg',null,'Slow the eccentric for more muscle activation.'),
('Pull-Ups','Back','Advanced','Lats',80,'Pull-up Bar',10,'Hang from bar, pull chest to bar, lower with control.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Engage the lats first by pulling shoulders down and back.'),
('Bent-Over Row','Back','Intermediate','Back',85,'Barbell',14,'Hinge at hips, row bar to lower ribs, lower with control.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Keep the core braced and avoid rounding the spine.'),
('Lat Pulldown','Back','Beginner','Lats',70,'Cable Machine',12,'Pull bar to upper chest, control the negative.','https://images.pexels.com/photos/19545238/pexels-photo-19545238.jpeg',null,'Lead with the elbows to better target the lats.'),
('Squats','Legs','Beginner','Quads',100,'Bodyweight',10,'Feet shoulder-width, sit back and down, drive through heels.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Knees track over toes; keep chest tall.'),
('Romanian Deadlift','Legs','Intermediate','Hamstrings',110,'Barbell',14,'Hinge at hips with soft knees, lower bar along legs, drive hips forward.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Feel a stretch in the hamstrings before driving up.'),
('Walking Lunges','Legs','Beginner','Quads/Glutes',80,'Dumbbells',12,'Step forward, drop back knee, push through front heel.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Keep torso upright and core engaged.'),
('Overhead Press','Shoulders','Intermediate','Shoulders',75,'Barbell',12,'Press bar overhead to full lockout, lower to clavicle.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Squeeze glutes to protect the lower back.'),
('Lateral Raises','Shoulders','Beginner','Side Delts',45,'Dumbbells',10,'Raise dumbbells to shoulder height with slight bend, lower slowly.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Lead with the elbows, not the hands.'),
('Bicep Curls','Arms','Beginner','Biceps',50,'Dumbbells',10,'Curl dumbbells up, squeeze, lower with control.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Avoid swinging — keep elbows pinned to your sides.'),
('Tricep Dips','Arms','Intermediate','Triceps',60,'Bodyweight',10,'Lower body between benches or bars, press up.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Keep elbows back, not flared, to protect the shoulders.'),
('Plank','Core','Beginner','Core',30,'Bodyweight',5,'Hold a straight-body position on forearms, brace core.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Squeeze glutes and draw ribs down to brace.'),
('Russian Twists','Core','Beginner','Obliques',45,'Bodyweight',8,'Sit, lean back, rotate torso side to side.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Move from the torso, not the arms.'),
('Running','Cardio','Beginner','Full Body',120,'None',20,'Steady pace, swing arms, land midfoot.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Warm up with a brisk walk for 5 minutes first.'),
('Jump Rope','Cardio','Intermediate','Full Body',140,'Jump Rope',12,'Light bounces on balls of feet, wrists turn the rope.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Stay loose; relax the shoulders and breathe steadily.'),
('Sun Salutation','Yoga','Beginner','Full Body',40,'Mat',10,'Flow through a sequence of poses synced with breath.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Move with the breath, not against it.'),
('Warrior Pose','Yoga','Beginner','Legs/Core',35,'Mat',8,'Lunge deeply, arms extended, hold and breathe.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Stack the front knee over the ankle.'),
('HIIT Circuit','HIIT','Advanced','Full Body',180,'Bodyweight',20,'Alternate 40s work / 20s rest across 5 movements.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Pace the first round so you can sustain intensity throughout.'),
('Burpees','HIIT','Intermediate','Full Body',150,'Bodyweight',10,'Drop, push-up, jump up, repeat.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Keep the hips low on the push-up for full-body benefit.'),
('Hamstring Stretch','Stretching','Beginner','Hamstrings',20,'None',5,'Sit, extend one leg, reach toward toes, hold.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Hold the stretch; never bounce into the end range.'),
('Shoulder Mobility','Stretching','Beginner','Shoulders',20,'None',5,'Arm circles and cross-body stretches.','https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg',null,'Move slowly through the full range of motion.')
ON CONFLICT DO NOTHING;
