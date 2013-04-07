#!/bin/bash

function lps(){
     if [[ "$2"="nop" ]]; then
         adb shell pm list packages|grep $1|sed -e 's/package://g'
     elif [[ "$2"="as_param" ]]; then
         adb shell pm list packages|grep $1|sed -e 's/package://g'|tr  '\n' ' ';
     else
         adb shell pm list packages|grep $1
     fi
 }

 function mRemPkg(){
     for ((i=1; i <= $#;i++));
     do
         pkgName=${!i}
         echo removing now $pkgName
         adb uninstall $pkgName
         echo done.
     done
}	 
