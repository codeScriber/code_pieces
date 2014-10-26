BEGIN { count=0; read=0;lastLine=0 
}
/^-*BEGIN CERTIFICATE-*$/ { read=1}

{ 
  if( read ){
      arr[count]=$0
      count++
  }
}

/^-*END CERTIFICATE-*$/ { 
    read=0;
    arr[count]=$0
    lastLine=count
    count=0
}

END { 
for(i=0; i < lastLine; i++ ){ print  arr[i]}
}
