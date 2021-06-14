#!/bin/bash

echo "Creating new plot with farmer key $FARMER_KEY and pool key $POOL_KEY"

echo "Starting the plot creation..."

if [ ! -d $OUTPUT_DIR ]; then
  echo 'Creating temp path'
  mkdir $OUTPUT_DIR
fi
if [ ! -d $TEMP_DIR ]; then
  echo 'Creating final path'
  mkdir $TEMP_DIR
fi

$MADMAX_PATH -r $CPU_THREADS -t $TEMP_DIR/ -d $OUTPUT_DIR/ -p $POOL_KEY -f $FARMER_KEY