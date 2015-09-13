/* Return the string of non-alnum characters that may occur
   as a valid symbol component, in the standard assembler symbol
   syntax.  */

function standard_symbol_characters () {
  return "_$.";
}

/* Return the string of non-alnum characters that may occur
   as a valid symbol name component in an HP object file.

   Note that, since HP's compiler generates object code straight from
   C++ source, without going through an assembler, its mangled
   identifiers can use all sorts of characters that no assembler would
   tolerate, so the alphabet this function creates is a little odd.
   Here are some sample mangled identifiers offered by HP:

  typeid*__XT24AddressIndExpClassMember_
  [Vftptr]key:__dt__32OrdinaryCompareIndExpClassMemberFv
  __ct__Q2_9Elf64_Dyn18{unnamed.union.#1}Fv

   This still seems really weird to me, since nowhere else in this
   file is there anything to recognize curly brackets, parens, etc.
   I've talked with Srikanth <srikanth@cup.hp.com>, and he assures me
   this is right, but I still strongly suspect that there's a
   misunderstanding here.

   If we decide it's better for c++filt to use HP's assembler syntax
   to scrape identifiers out of its input, here's the definition of
   the symbol name syntax from the HP assembler manual:

       Symbols are composed of uppercase and lowercase letters, decimal
       digits, dollar symbol, period (.), ampersand (&), pound sign(#) and
       underscore (_). A symbol can begin with a letter, digit underscore or
       dollar sign. If a symbol begins with a digit, it must contain a
       non-digit character.

   So have fun.  */
function hp_symbol_characters () {
  return "_$.<>#,*&[]:(){}";
}

function demangle (mangledName) {
  var result;
  var skipFirst = 0;

  if (mangledName[0] === '.' || mangledName[0] === '$') {
    ++skipFirst;
  }

  if (strip_underscore && mangledName[skipFirst] === '_') {
    ++skipFirst;
  }

  result = cplusDemangle.write(mangledName + skipFirst, flags);

  if (!result) {
    return mangledName;
  } else {
    if (mangledName[0] === '.') {
      // putchar('.')
    }

    return result;
  }
}


