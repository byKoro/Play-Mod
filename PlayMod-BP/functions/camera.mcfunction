execute as @a[tag=camfollow] at @s run camera @s set minecraft:free ease 0.8 spring pos ^-1 ^1.5 ^-1.8 rot ~  ~
execute as @a[hasitem={item=cam:cam}] run tag @s add HandCam
execute as @a[tag=HandCam] unless entity @s[hasitem={item=cam:cam}] run camera @s clear
execute as @a[tag=HandCam] unless entity @s[hasitem={item=cam:cam}] run tag @s remove HandCam