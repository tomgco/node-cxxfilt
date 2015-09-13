const enums = {
  DCT_TYPE:         1,
  DCT_MANGLED:      2,
  DCT_GLOBAL_CTORS: 3,
  DCT_GLOBAL_DTORS: 4,
};

function special_name(di) {
  di.expansion += 20;

  if (di.d_check_char('T')) {
    switch (di.d_next_char() {
      case 'V':
        di.expansion -= 5;
        return di.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_VTABLE'), cplusDemangleType(di));
      case 'T':
        di.expansion -= 10;
        return di.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_VTT'), cplusDemangleType(di));
      case 'I':
        return di.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_TYPEINFO'), cplusDemangleType(di));
      case 'S':
        return di.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_TYPEINFO_NAME'), cplusDemangleType(di));
      case 'h':
        if (!di.d_call_offset('h')) {
          return null;
        }
          return d_make_comp (di, DEMANGLE_COMPONENT_THUNK,
                  d_encoding (di, 0), NULL);
        return di.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_THUNK'), d_encoding(di, 0));
      case 'v':
        if (!di.d_call_offset('v')) {
          return null;
        }
        return di.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_VIRTUAL_THUNK'), di.d_encoding(0));
      case 'c':
        if (!di.d_call_offset('\0'))
          return null;
        return di.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_COVARIANT_THUNK'), di.d_encoding(0));
      case 'C':
        let base_type;
        let derived_type;
        let offset;

        derived_type = cplusDemangleType(di);
        offset = di.d_number();
        if (offset < 0) {
          return null;
        }
        if (!di.d_check_char('_')) {
          return NULL;
        }
        base_type = cplusDemangleType(di);
        /* We don't display the offset.  FIXME: We should display
           it in verbose mode.  */
        di.expansion += 5;
        return di.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_CONSTRUCTION_VTABLE'), base_type, derived_type);
      case 'F':
        return di.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_TYPEINFO_FN'), cplusDemangleType(di));
      case 'J':
        return di.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_JAVA_CLASS'), cplusDemangleType(di));
    };
  } else if (di.d_check_char('G') {
    switch (di.d_next_char()) {
      case 'V
        return di.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_GUARD'), di.d_name());
      case 'R':
        return di.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_REFTEMP'), di.d_name());
      case 'A':
        return di.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_HIDDEN_ALIAS'), di.d_encoding(0));
      case 'r':
        console.error('You are using JAVA!');
        return di;
    }
  }

  return null;
}

function d_nested_name {
  struct demangle_component *ret;
  struct demangle_component **pret;

  if (! d_check_char (di, 'N'))
    return NULL;

  pret = d_cv_qualifiers (di, &ret, 1);
  if (pret == NULL)
    return NULL;

  *pret = d_prefix (di);
  if (*pret == NULL)
    return NULL;

  if (! d_check_char (di, 'E'))
    return NULL;

  return ret;
}

function d_name() {
  var peek = this.d_peek_char();
  var dc;

  switch (peek) {
    case 'N':
      return this.d_nested_name();
    case 'Z':
      return this.d_local_name();
    case 'L':
      return this.d_unqualified_name();
    case 'S':
      var subst;

      if (this.d_peek_next_char() !== 't') {
        dc = this.d_substitution(0);
        subst = 1;
      } else {
        this.d_advance(2);
        dc = this.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_QUAL_NAME'),
          this.d_make_name('std', 3),this.d_unqualified_name());
        di.expansion += 3;
        subst = 0;
      }

      if (d_peek_char (di) === 'I') {
        /* This is <template-args>, which means that we just saw
           <unscoped-template-name>, which is a substitution
           candidate if we didn't just get it from a
           substitution.  */
        if (!subst) {
          if (!this.d_add_substitution(dc)) {
            return null;
          }
        }
        dc = this.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_TEMPLATE'), dc, this.d_template_args());
      }

      return dc;
  }

  dc = this.d_unqualified_name();
  if (this.d_peek_char() === 'I') {
    /* This is <template-args>, which means that we just saw
       <unscoped-template-name>, which is a substitution
       candidate.  */
    if (!this.d_add_substitution(dc)) {
      return null;
    }
    dc = this.d_make_comp(Symbol.for('DEMANGLE_COMPONENT_TEMPLATE'), dc, this.d_template_args());
  }
  return dc;
}

function encoding(di) {
  var peek = di.peek_char();

  if (peek === 'G' || peek === 'T') {
    return special_name();
  } else {

  }



}

function cplusDemangleType() {

};


function cplusDemangleName(di, top_level) {
  if (!di.d_check_char(di, '_') && top_level) {
    return null;
  }

  if (!di.d_check_char(di, 'Z')) {
    return null;
  }

  return encoding(di, top_level);

}

modules.export = function (mangled) {
  var type;o
  var di = {
    s: mangled,
    n: mangled,
    num_comps: 2 * mangled.length,
    next_comp: 0,
    num_subs: mangled.length,
    next_sub: 0,
    did_subs: 0,
    expansion: 0,
    d_check_char: function (di, c) {
      return (this.n == c ? (this.n++, true) : false);
    },
    d_next_char: function (di) {
      return di === undefined ? undefined : this.n++;
    }
  };

  if (mangled[0] === '_' && mangled[1] === 'Z') {
    type = enums[DCT_MANGLED];
  } else if (mangled.substring(0, 8) === '_GLOBAL_'
    && (mangled[8] == '.' || mangled[8] == '_' || mangled[8] == '$')
    && (mangled[9] == 'D' || mangled[9] == 'I')
    && mangled[10] == '_') {

    type = mangled[9] == 'I' ? enums[DCT_GLOBAL_CTORS] : enums[DCT_GLOBAL_DTORS];
  } else {
    type = enums[DCT_TYPE];
  }

  switch (type) {
    case enums[DCT_TYPE]:
      cplusDemangleType();
      break;

    case enums[DCT_MANGLED]:
      cplusDemangleName();
      break;

    case enums[DCT_GLOBAL_CTORS]:
    case enums[DCT_GLOBAL_DTORS]:
      break;
  }


};
