


context tabs {
    entity user_information {
      key  ID        : UUID;
        USER_NAME : String(10)
    }
entity Pictures {
  key ID : UUID;
  @Core.MediaType: mediaType
  content : LargeBinary;
  @Core.IsMediaType: true
  mediaType : String;
}
 

    entity GET_JOBS {
        key ID       : String;
            JOB_NAME : String;
            STATUS   : String;
    }

    entity E_LEARN {
        key ID   : String(10);
            DATA : LargeString;
    }
}
