OUTPUT_DIR=../src/proto
OUTPUT_FP=$OUTPUT_DIR/tiktok-schema.ts

protoc --plugin=../node_modules/ts-proto/protoc-gen-ts_proto ./tiktok-schema.proto -I. \
--ts_proto_opt=forceLong=string \
--ts_proto_out=$OUTPUT_DIR \
--ts_proto_opt=env=browser

if [ $? -ne 0 ]; then
  echo "Failed to generate proto"
  exit 1
fi

if [ ! -f $OUTPUT_FP ]; then
  echo "File not found!"
  exit 1
fi

tsx ./rename-interfaces.ts $OUTPUT_FP