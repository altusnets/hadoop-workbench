// JAXB

package com.directv.hw.hadoop.oozie.bindings.sqoop_action_0_2.binding

import javax.xml.bind.annotation.{XmlAccessType, XmlAccessorType, XmlAttribute, XmlType}

import scala.beans.BeanProperty


@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "MKDIR", namespace = "uri:oozie:sqoop-action:0.2") class MKDIR {
  @XmlAttribute(name = "path", required = true)
  @BeanProperty var path: String = null

}
