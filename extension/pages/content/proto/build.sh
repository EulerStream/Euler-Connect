
protoc --plugin=../node_modules/ts-proto/protoc-gen-ts_proto ./tiktok-schema.proto -I. --ts_proto_opt=forceLong=string --ts_proto_out=../src/modules --ts_proto_opt=env=browser