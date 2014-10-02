extractRamdisk.sh: takes ramdisk.cpio.gz and extracts it to a dir, used with boot.img to update it's files.
repackRamdisk.sh: take a dir previsouly unpacked with the extractRamdisk.sh and repack it to newramdisk.cpio.gz
mkbootimg, unmkbootimg: tools i got from xda (binaries that takes mkbootimg by google and unmkbootimg just takes google's code and reverses it, plus prints the values so it's easy to repack.

